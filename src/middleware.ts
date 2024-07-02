import chain from "./middlewares/chain";
import authMiddleware from "./middlewares/authMiddleware";
import languageMiddleware from "./middlewares/languageMiddleware";
import maintenanceMiddleware from "./middlewares/maintenanceMiddleware";

const middlewares = [languageMiddleware, maintenanceMiddleware, authMiddleware];
const middleware = chain(middlewares);
export default middleware;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
