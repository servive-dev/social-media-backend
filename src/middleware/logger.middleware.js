export const logger = (req, res, next) => {

   const start = process.hrtime();

   res.on("finish", () => {

      const diff = process.hrtime(start);
      const duration = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

      // SAFE BODY
      const safeBody = { ...req.body };
      delete safeBody.password;
      delete safeBody.token;
      delete safeBody.otp;

      const log = {
         method: req.method,
         url: req.originalUrl,
         statusCode: res.statusCode,
         duration: `${duration}ms`,
         message: res.statusMessage || null,

         userId: req.user?.id ?? null,

         ip: req.headers["x-forwarded-for"] || req.ip,
         userAgent: req.get("User-Agent"),

         query: req.query ? JSON.stringify(req.query) : null,
         body: Object.keys(safeBody).length ? JSON.stringify(safeBody) : null,

         time: new Date().toISOString(),
      };

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

// export const logger = (req, res, next) => {

//    const start = process.hrtime();

//    res.on("finish", () => {

//       const diff = process.hrtime(start);
//       const duration = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

//       const log = {
//          method: req.method,
//          url: req.originalUrl,
//          statusCode: res.statusCode,
//          duration: `${duration}ms`,

//          // 👇 WHY CONTEXT (IMPORTANT ADDITION)
//          message: res.statusMessage || null,

//          // 👇 USER CONTEXT
//          userId: req.user?.id || "guest",

//          // 👇 REQUEST CONTEXT
//          ip: req.ip,
//          userAgent: req.get("User-Agent"),

//          // 👇 DEBUG CONTEXT
//          query: req.query,
//          body: req.body,

//          time: new Date().toISOString(),
//       };

//       // 🔥 WHY classification
//       if (res.statusCode >= 500) {
//          console.error("❌ SERVER ERROR:", log);
//       } else if (res.statusCode >= 400) {
//          console.warn("⚠️ CLIENT ERROR:", log);
//       } else {
//          console.log("✅ SUCCESS:", log);
//       }
//    });

//    next();
// };
