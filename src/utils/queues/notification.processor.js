import { chunkArray } from "../helpers.js";
import notificationRepo from "../../repositories/notification.repository.js";
import {
  sendToSingleUser,
  sendToMultipleUsers,
} from "../firebase.helper.js";
import ApiError from "../ApiError.js";

class NotificationProcessor {
  async handleNotificationJob(data) {
    const { logId, tokens = [], title, message } = data;
    console.log(`\n🔄 Processing Notification Log ID: ${logId}`);

    if (!tokens.length) {
      console.log("⚠️ No valid tokens found");
      throw new ApiError(400,"No valid FCM tokens found");
    }

    const batches = chunkArray(tokens, 500);
    console.log(`📦 Total batches to send: ${batches.length}`);

    let batchCount = 1;

    for (const batch of batches) {
      console.log(`🚀 Sending batch ${batchCount} (size: ${batch.length})`);
      if (batch.length === 1) {
        await sendToSingleUser(batch[0], title, message);
      } else {
        await sendToMultipleUsers(batch, title, message);
      }
      console.log(`✅ Batch ${batchCount} sent successfully`);
      batchCount++;
    }

    await notificationRepo.updateNotificationStatus(logId, {
      status: "sent",
      recipients_count: tokens.length,
    });

    console.log(`📝 Notification Log ${logId} updated to SENT`);
    console.log("🎉 Notification processing completed\n");

    return true;
  }

  async handleFailure(logId) {
    console.log(`🛑 Updating Log ${logId} as FAILED`);

    await notificationRepo.updateNotificationStatus(logId, {
      status: "failed",
    });
  }
}

export default new NotificationProcessor();
