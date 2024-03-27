import chain from "./middlewares/chain";
import authMiddleware from "./middlewares/authMiddleware";
import languageMiddleware from "./middlewares/languageMiddleware";

const middlewares = [languageMiddleware, authMiddleware];
const middleware = chain(middlewares);
export default middleware;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
