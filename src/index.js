import app from "./server.js";
import connection from "./database/database.js";

// Inicializar base de datos y levantar servidor
(async () => {
  try {
    await connection();
    const port = app.get("port") || 3000;
    app.listen(port, () => {
      console.log(
        `Ejecutándose en: http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error("❌ Error al iniciar servidor:", error);
    process.exit(1);
  }
})();