import app from "@/app";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

const port = parseInt(env.PORT, 10);

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});
