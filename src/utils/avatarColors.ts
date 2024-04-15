// Color palette for user identification
const palette: string[] = [
  'bg-red-cool-10',
  'bg-blue-10',
  'bg-orange-warm-10',
  'bg-yellow-5',
  'bg-green-5'
];

// Hashes a string to generate a numeric value
const hashString = (inputString: string): number => {
  // Remove leading and trailing spaces, and replace spaces with an empty string
  const trimmedString: string = inputString.trim().replace(/\s/g, '');

  // Initial hash value
  let hash: number = 5381;

  // Iterate over each character in the trimmed string
  for (let i = 0; i < trimmedString.length; i += 1) {
    const char = trimmedString.charCodeAt(i);
    // Update the hash value using DJB2 algorithm
    hash = hash * 33 + char;
  }

  // Ensure the hash is non-negative
  return Math.abs(hash);
};

// Gets a color from the palette based on a username
const getAvatarColorsFromUsername = (username: string): string => {
  // Calculate the hash value of the username
  const hashValue: number = hashString(username);
  // Map the hash value to an index in the palette array
  const index: number = hashValue % palette.length;
  // Retrieve and return the color from the palette
  return palette[index];
};

export default getAvatarColorsFromUsername;
