import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const successExample = (message, data, statusCode = 200, pagination = null) => {
  const body = {
    code: statusCode,
    status: true,
    message,
    data,
  };
  if (pagination) body.pagination = pagination;
  return {
    name: "Success",
    status: statusCode === 201 ? "Created" : "OK",
    code: statusCode,
    _postman_previewlanguage: "json",
    header: [{ key: "Content-Type", value: "application/json" }],
    body: JSON.stringify(body, null, 2),
  };
};

const jsonBody = (payload) => ({
  mode: "raw",
  raw: JSON.stringify(payload, null, 2),
  options: { raw: { language: "json" } },
});

const authHeader = (tokenVar) => ({
  key: "Authorization",
  value: `Bearer {{${tokenVar}}}`,
});

const url = (routePath, query = "") => ({
  raw: `{{baseUrl}}${routePath}${query}`,
  host: ["{{baseUrl}}"],
  path: routePath.replace(/^\//, "").split("/"),
});

const folder = (name, items) => ({ name, item: items });

const request = (name, method, routePath, options = {}) => {
  const headers = [{ key: "Content-Type", value: "application/json" }];
  if (options.auth) headers.push(authHeader(options.auth));
  if (options.multipart) headers.length = 0;

  const item = {
    name,
    request: {
      method,
      header: headers,
      url: url(routePath, options.query || ""),
    },
    response: [
      successExample(
        options.successMessage,
        options.successData,
        options.statusCode || 200,
        options.pagination
      ),
    ],
  };

  if (options.body) {
    item.request.body = jsonBody(options.body);
  }

  if (options.formdata) {
    item.request.body = { mode: "formdata", formdata: options.formdata };
    if (options.auth) {
      item.request.header = [authHeader(options.auth)];
    }
  }

  if (options.testScript) {
    item.event = [
      {
        listen: "test",
        script: {
          type: "text/javascript",
          exec: options.testScript,
        },
      },
    ];
  }

  return item;
};

const masterCrudFolder = (config) => {
  const {
    folderName,
    basePath,
    sampleRow,
    listMessage,
    createMessage,
    updateMessage,
    deleteMessage,
    createRequestName,
  } = config;

  const listData = [sampleRow];
  const singular = folderName.replace(/s$/, "");

  return folder(folderName, [
    request(`List ${folderName}`, "GET", basePath, {
      auth: "admin_token",
      query: "?page=1&limit=20&status=1",
      successMessage: listMessage,
      successData: listData,
      pagination: {
        totalItems: 1,
        currentPage: 1,
        totalPages: 1,
        limit: 20,
      },
    }),
    request(createRequestName || `Create ${singular}`, "POST", basePath, {
      auth: "admin_token",
      body: sampleRow.createBody,
      successMessage: createMessage,
      successData: sampleRow,
      statusCode: 201,
    }),
    request(`Update ${singular}`, "PUT", `${basePath}/:id`, {
      auth: "admin_token",
      body: sampleRow.updateBody,
      successMessage: updateMessage,
      successData: { ...sampleRow, ...sampleRow.updateBody },
    }),
    request(`Deactivate ${singular}`, "DELETE", `${basePath}/:id`, {
      auth: "admin_token",
      successMessage: deleteMessage,
      successData: { ...sampleRow, status: 2 },
    }),
  ]);
};

const healthRequest = {
  name: "Health",
  request: {
    method: "GET",
    header: [],
    url: url("/health"),
  },
  response: [
    {
      name: "Success",
      status: "OK",
      code: 200,
      _postman_previewlanguage: "plain",
      header: [{ key: "Content-Type", value: "text/html; charset=utf-8" }],
      body: "Health Ok",
    },
  ],
};

const collection = {
  info: {
    _postman_id: "inyatri-api-collection",
    name: "INYATRI",
    description:
      "InYatri API collection. Set `baseUrl` (e.g. http://localhost:5000). Run Admin Login or Verify Otp first to populate tokens.",
    schema:
      "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  variable: [
    { key: "baseUrl", value: "http://localhost:5000" },
    { key: "admin_token", value: "" },
    { key: "user_token", value: "" },
  ],
  item: [
    folder("User", [
      folder("Auth", [
        request("Send Otp", "POST", "/api/user/v1/auth/send-otp", {
          body: { country_code: "+91", mobile: "7535040111" },
          successMessage: "OTP sent successfully",
          successData: { isExistingUser: false, expiresIn: 60 },
        }),
        request("Verify Otp", "POST", "/api/user/v1/auth/verify-otp", {
          body: { country_code: "+91", mobile: "7535040111", otp: "123456" },
          successMessage: "OTP verified successfully",
          successData: {
            isNewUser: true,
            isExistingUser: false,
            requiresProfile: true,
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example",
            user: {
              id: 1,
              mobile: "7535040111",
              country_code: "+91",
              full_name: "",
              requires_profile: true,
            },
          },
          testScript: [
            "const json = pm.response.json();",
            "if (json?.data?.token) {",
            "  pm.collectionVariables.set('user_token', json.data.token);",
            "}",
          ],
        }),
        request("Resend Otp", "POST", "/api/user/v1/auth/resend-otp", {
          body: { country_code: "+91", mobile: "7535040111" },
          successMessage: "OTP sent successfully",
          successData: { isExistingUser: false, expiresIn: 60 },
        }),
        request("Complete Profile", "POST", "/api/user/v1/auth/complete-profile", {
          auth: "user_token",
          body: {
            full_name: "John Doe",
            email: "john@example.com",
            dob: "1995-06-15",
            agreed_to_terms: true,
            marketing_opt_in: false,
          },
          successMessage: "Profile updated successfully",
          successData: {
            id: 1,
            mobile: "7535040111",
            full_name: "John Doe",
            email: "john@example.com",
            requires_profile: false,
          },
        }),
        request("Logout", "POST", "/api/user/v1/auth/logout", {
          auth: "user_token",
          successMessage: "Logged out successfully",
          successData: [],
        }),
      ]),
    ]),
    folder("Admin", [
      folder("Auth", [
        request("Admin Login", "POST", "/api/admin/v1/auth/admin-login", {
          body: {
            email: "inyatriadmin@gmail.com",
            password: "Admin@2300",
          },
          successMessage: "Admin logged in successfully",
          successData: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example",
            admin: {
              id: 1,
              email: "inyatriadmin@gmail.com",
              name: "Admin",
              status: 1,
            },
          },
          testScript: [
            "const json = pm.response.json();",
            "if (json?.data?.token) {",
            "  pm.collectionVariables.set('admin_token', json.data.token);",
            "}",
          ],
        }),
      ]),
      masterCrudFolder({
        folderName: "Car Brands",
        basePath: "/api/admin/v1/car-brands",
        listMessage: "Car brands fetched successfully",
        createMessage: "Car brand created successfully",
        updateMessage: "Car brand updated successfully",
        deleteMessage: "Car brand deactivated successfully",
        createRequestName: "Create Car Brand",
        sampleRow: {
          id: 1,
          brand_name: "Maruti Suzuki",
          status: 1,
          createBody: { brand_name: "Maruti Suzuki", status: 1 },
          updateBody: { brand_name: "Maruti Suzuki Updated" },
        },
      }),
      masterCrudFolder({
        folderName: "Car Features",
        basePath: "/api/admin/v1/car-features",
        listMessage: "Car features fetched successfully",
        createMessage: "Car feature created successfully",
        updateMessage: "Car feature updated successfully",
        deleteMessage: "Car feature deactivated successfully",
        createRequestName: "Create Car Feature",
        sampleRow: {
          id: 1,
          name: "Air Conditioning",
          status: 1,
          createBody: { name: "Air Conditioning", status: 1 },
          updateBody: { name: "AC" },
        },
      }),
      masterCrudFolder({
        folderName: "States",
        basePath: "/api/admin/v1/states",
        listMessage: "States fetched successfully",
        createMessage: "State created successfully",
        updateMessage: "State updated successfully",
        deleteMessage: "State deactivated successfully",
        createRequestName: "Create State",
        sampleRow: {
          id: 1,
          state_name: "Maharashtra",
          country_code: "IN",
          status: 1,
          createBody: {
            state_name: "Maharashtra",
            country_code: "IN",
            status: 1,
          },
          updateBody: { state_name: "Maharashtra" },
        },
      }),
      masterCrudFolder({
        folderName: "Car Types",
        basePath: "/api/admin/v1/car-types",
        listMessage: "Car types fetched successfully",
        createMessage: "Car type created successfully",
        updateMessage: "Car type updated successfully",
        deleteMessage: "Car type deactivated successfully",
        createRequestName: "Create Car Type",
        sampleRow: {
          id: 1,
          type_name: "SUV",
          status: 1,
          createBody: { type_name: "SUV", status: 1 },
          updateBody: { type_name: "Compact SUV" },
        },
      }),
      folder("Cars", [
        request("Car Meta", "GET", "/api/admin/v1/cars/meta", {
          auth: "admin_token",
          successMessage: "Car metadata fetched successfully",
          successData: {
            fuelTypes: ["petrol", "diesel", "cng"],
            transmissions: ["manual", "automatic"],
            seats: [5, 6, 7],
          },
        }),
        request("Upload Single Image", "POST", "/api/admin/v1/cars/upload/image", {
          auth: "admin_token",
          multipart: true,
          formdata: [
            { key: "image", type: "file", src: [] },
          ],
          successMessage: "Image uploaded successfully",
          successData: {
            url: "https://res.cloudinary.com/demo/image/upload/v1/inyatri/cars/sample.jpg",
            public_id: "inyatri/cars/sample",
          },
        }),
        request("Upload Multiple Images", "POST", "/api/admin/v1/cars/upload/images", {
          auth: "admin_token",
          multipart: true,
          formdata: [
            { key: "images", type: "file", src: [] },
            { key: "images", type: "file", src: [] },
          ],
          successMessage: "Images uploaded successfully",
          successData: [
            {
              url: "https://res.cloudinary.com/demo/image/upload/v1/inyatri/cars/sample1.jpg",
              public_id: "inyatri/cars/sample1",
            },
            {
              url: "https://res.cloudinary.com/demo/image/upload/v1/inyatri/cars/sample2.jpg",
              public_id: "inyatri/cars/sample2",
            },
          ],
        }),
        request("List Cars", "GET", "/api/admin/v1/cars", {
          auth: "admin_token",
          query: "?page=1&limit=20&status=1",
          successMessage: "Cars fetched successfully",
          successData: [
            {
              id: 1,
              car_name: "Swift VXI",
              vehicle_number: "MH12AB1234",
              brand_id: 1,
              state_id: 1,
              status: 1,
            },
          ],
          pagination: {
            totalItems: 1,
            currentPage: 1,
            totalPages: 1,
            limit: 20,
          },
        }),
        request("Create Car", "POST", "/api/admin/v1/cars", {
          auth: "admin_token",
          body: {
            car_name: "Swift VXI",
            vehicle_number: "MH12AB1234",
            brand_id: 1,
            state_id: 1,
            location: "Pune, Maharashtra",
            latitude: 18.5204,
            longitude: 73.8567,
            fuel_type: "petrol",
            feature_ids: [1, 2],
            made_year: 2022,
            model: "Swift",
            travelled_km: 15000,
            seats: 5,
            car_type_id: 1,
            transmission: "manual",
            price_per_hour: 500,
            weekend_price_per_hour: 700,
            short_description: "Well maintained hatchback",
            main_image: "https://res.cloudinary.com/demo/image/upload/v1/inyatri/cars/main.jpg",
            additional_images: [
              "https://res.cloudinary.com/demo/image/upload/v1/inyatri/cars/a1.jpg",
              "https://res.cloudinary.com/demo/image/upload/v1/inyatri/cars/a2.jpg",
              "https://res.cloudinary.com/demo/image/upload/v1/inyatri/cars/a3.jpg",
              "https://res.cloudinary.com/demo/image/upload/v1/inyatri/cars/a4.jpg",
            ],
            enable_monthly_subscription: false,
            refundable_deposit: 5000,
            home_delivery_charge: 2000,
            show_on_top: false,
            home_delivery_available: true,
            status: 1,
          },
          successMessage: "Car created successfully",
          successData: { id: 1, car_name: "Swift VXI", status: 1 },
          statusCode: 201,
        }),
        request("Get Car By Id", "GET", "/api/admin/v1/cars/:id", {
          auth: "admin_token",
          successMessage: "Car fetched successfully",
          successData: {
            id: 1,
            car_name: "Swift VXI",
            vehicle_number: "MH12AB1234",
            brand: { id: 1, brand_name: "Maruti Suzuki" },
            state: { id: 1, state_name: "Maharashtra" },
            status: 1,
          },
        }),
        request("Update Car", "PUT", "/api/admin/v1/cars/:id", {
          auth: "admin_token",
          body: {
            car_name: "Swift VXI Updated",
            price_per_hour: 550,
          },
          successMessage: "Car updated successfully",
          successData: {
            id: 1,
            car_name: "Swift VXI Updated",
            price_per_hour: 550,
            status: 1,
          },
        }),
        request("Deactivate Car", "PATCH", "/api/admin/v1/cars/:id/status", {
          auth: "admin_token",
          body: { status: 2 },
          successMessage: "Car deactivated successfully",
          successData: { id: 1, car_name: "Swift VXI", status: 2 },
        }),
        request("Activate Car", "PATCH", "/api/admin/v1/cars/:id/status", {
          auth: "admin_token",
          body: { status: 1 },
          successMessage: "Car activated successfully",
          successData: { id: 1, car_name: "Swift VXI", status: 1 },
        }),
      ]),
    ]),
    healthRequest,
  ],
};

const outPath = path.join(__dirname, "INYATRI.postman_collection.json");
fs.writeFileSync(outPath, JSON.stringify(collection, null, 2));
console.log(`Generated: ${outPath}`);
