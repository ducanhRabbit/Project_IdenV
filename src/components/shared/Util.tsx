const getRandomImage = () => {
  const imageList = [
    "https://i.pinimg.com/564x/f7/9a/42/f79a42ef50ff3a7301b95bf88429b241.jpg",
    "https://i.pinimg.com/564x/54/04/41/5404413d0a01d5764d5f3565779e811e.jpg",
    "https://i.pinimg.com/564x/e8/eb/f0/e8ebf0499c4ffe8fead65b68288a4c49.jpg",
    "https://i.pinimg.com/564x/23/1b/8b/231b8b38a86bdc350796a678b0905de1.jpg",
    "https://i.pinimg.com/564x/72/ce/bd/72cebdb1b82593324bcaf6780f0bf954.jpg",
    "https://i.pinimg.com/564x/22/43/4c/22434cc91002c0811e625bf3a3e9ac50.jpg",
    "https://i.pinimg.com/564x/7d/c6/87/7dc687744ee31a786d62d6d5967a2f46.jpg",
    "https://i.pinimg.com/564x/52/e5/d8/52e5d82dfdf41afd9d5a6b93495f12f4.jpg",
    "https://i.pinimg.com/564x/0d/e6/b0/0de6b0228dd45515bfd664914a58488c.jpg",
    "https://i.pinimg.com/564x/38/18/d3/3818d336fc7a78f77a71420de46d9947.jpg",
  ];

  const randomImg = imageList[Math.floor(Math.random() * imageList.length)];
  return randomImg;
};

export default getRandomImage;

export const convertErrorCodeToMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use": {
      return "Email is already in use.";
    }
    case "auth/user-not-found": {
      return "User not found";
    }
    case "auth/wrong-password": {
      return "Password is incorrect.";
    }
    case "auth/invalid-email": {
      return "auth/invalid-email";
    }
    case "auth/too-many-requests": {
      return "You request too many times!";
    }
    default: {
      return "Something weird happened.";
    }
  }
};
