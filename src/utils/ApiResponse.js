class ApiResponse {
  constructor(statusCode, data, message, message = "sucess") {
    (this.statusCode = statusCode), (this.dat = data), (this.message = message);
    this.sucess = statusCode < 400;
  }
}
export default ApiResponse;
