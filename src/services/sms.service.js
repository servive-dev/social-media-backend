import axios from "axios";

export const sendSMS = async ({ phone, otp }) => {
   try {
      const API_URL = "https://api.msg91.com/api/v5/flow/";
      const response = await axios.get(
         API_URL,
         {
            params: {
               authkey: process.env.MSG91_KEY,
               mobiles: phone,
               otp: otp,
               template_id: process.env.MSG91_TEMPLATE_ID
            }
         }
      );
      console.log("RESPONES DATA : ", response.data)
      return response.data;

   } catch (error) {
      console.error("SMS failed:", error);
      throw error;
   }
};