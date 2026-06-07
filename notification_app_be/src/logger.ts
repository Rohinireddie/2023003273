export async function Log(
  stack: string,
  level: string,
  packageName: string,
  message: string
) {
  console.log(`[${stack}] [${level}] [${packageName}] ${message}`);
}