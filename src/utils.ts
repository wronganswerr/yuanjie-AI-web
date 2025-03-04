export function validateResponse(response: any): boolean {
  if (
    response &&
    response.data &&
    response.data.code === 0 &&
    response.status === 200
  ) {
    return true;
  } else {
    // alert("serve error");
    return false;
  }
}
