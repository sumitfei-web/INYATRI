import crypto from "crypto";

// Generate random string
export const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString("hex");
};

// 🔒 Hash Token using SHA256
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Firebase max 500 per batch
export const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format full name
export const formatFullName = (firstName, lastName) => {
  return `${capitalize(firstName)} ${capitalize(lastName)}`;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/\s+/g, " ").replace(/[<>]/g, "");
};

// Generate slug from string
export const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const calculateAge = (dob) => {
  if (!dob) return null;

  const today = new Date();
  const birthDate = new Date(dob);

  if (isNaN(birthDate.getTime())) return null;

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // If birthday hasn't occurred yet this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 0 ? age : null;
};

export const formatCommunityResponse = (community, adminEmail) => {
  const categoryDescriptions = {
    dogs: "Communities for dog owners and enthusiasts",
    cats: "Communities for cat owners and enthusiasts",
    pet_parent: "General communities for all pet parents",
  };
  if (!community) return null;

  const data = community.toJSON();

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    category: data.category,
    category_description: categoryDescriptions[data.category] || "",
    cover_image: data.cover_image_url,
    is_active: data.is_active,
    member_count: data.member_count || 0,
    tags: (data.Tags || data.tags || []).map((tag) => ({
      id: tag.id,
      name: tag.name,
    })),

    created_by: adminEmail,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const formatPostResponse = (post) => {
  const data = post.toJSON ? post.toJSON() : post;

  if (!data) return data;

  const baseUrl = process.env.SHARE_BASE_URL || "";
  return {
    ...data,
    sharing_url: baseUrl
      ? `${baseUrl}?community_id=${data.community_id}&post_id=${data.id}`
      : null,
  };
};

export const formatPostsResponse = (posts) => {
  return posts.map((post) => formatPostResponse(post));
};

export const resolveImage = (author) => {
  if (author && !author.image && author.owner_media_urls) {
    const primaryImage = author.owner_media_urls.find(
      (media) => media.type === "image" && media.is_primary === true,
    );

    if (primaryImage) {
      author.image = primaryImage.url || null;
    }
  }
};


export const getDateRange = (filter) => {
  if (!filter) return null;

  const now = new Date();
  const istNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  let startIST;

  switch (filter) {
    case "today":
      startIST = new Date(istNow.setHours(0, 0, 0, 0));
      break;

    case "week":
      startIST = new Date(istNow);
      startIST.setDate(startIST.getDate() - 7);
      break;

    case "month":
      startIST = new Date(istNow.getFullYear(), istNow.getMonth(), 1);
      break;

    case "year":
      startIST = new Date(istNow.getFullYear(), 0, 1);
      break;

    default:
      return null;
  }

  return {
    startDate: new Date(startIST.toISOString()),
    endDate: new Date(),
  };
};

export const generateRandomPassword = () => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=";
  const all = uppercase + lowercase + numbers + symbols;

  const getRandom = (chars) => chars[Math.floor(Math.random() * chars.length)];

  // Ensure one of each
  let password = [
    getRandom(uppercase),
    getRandom(lowercase),
    getRandom(numbers),
    getRandom(symbols),
  ];

  // Add random characters to make at least 8 chars
  while (password.length < 10) {
    password.push(getRandom(all));
  }

  // Shuffle password
  return password.sort(() => 0.5 - Math.random()).join("");
};
