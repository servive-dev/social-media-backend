export const logger = (req, res, next) => {

   const start = process.hrtime();

   res.on("finish", () => {

      const diff = process.hrtime(start);
      const duration = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

      const log = {
         method: req.method,
         url: req.originalUrl,
         statusCode: res.statusCode,
         duration: `${duration}ms`,

         // 👇 WHY CONTEXT (IMPORTANT ADDITION)
         message: res.statusMessage || null,

         // 👇 USER CONTEXT
         userId: req.user?.id || "guest",

         // 👇 REQUEST CONTEXT
         ip: req.ip,
         userAgent: req.get("User-Agent"),

         // 👇 DEBUG CONTEXT
         query: req.query,
         body: req.body,

         time: new Date().toISOString(),
      };

      // 🔥 WHY classification
      if (res.statusCode >= 500) {
         console.error("❌ SERVER ERROR:", log);
      } else if (res.statusCode >= 400) {
         console.warn("⚠️ CLIENT ERROR:", log);
      } else {
         console.log("✅ SUCCESS:", log);
      }
   });

   next();
};
