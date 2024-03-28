// Types
import { CustomError } from "@/redux/api/apiSlice";

const isValidCustomError = (response: any): response is CustomError => {
  try {
    return (
      "errors" in response.data ||
      "error" in response ||
      "error" in response.data ||
      "error" === response.data.estado
    );
  } catch (err) {
    return false;
  }
};

const handleError = (response: any) => {
  const isValid = isValidCustomError(response);

  if (isValid) {
    return response.data.message || response.data.mensaje;
  } else {
    return "Serviço indisponível, tente novamente mais tarde.";
  }
};
export default handleError;
