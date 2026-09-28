declare module 'cypress-otp' {
  const generateOtp: (secret?: string) => string;

  export default generateOtp;
}
