const getRandomImage = ()=>{
    const imageList = [
        "https://i.pinimg.com/564x/c6/cc/65/c6cc65ad9b879a57dd04aa5e2252add4.jpg",
        "https://i.pinimg.com/564x/df/d9/9e/dfd99edb080f46f2af147e0709a119d5.jpg",
        "https://pbs.twimg.com/media/De76VrBXcAEDaY5.jpg",
        "https://i.pinimg.com/564x/bc/f9/e4/bcf9e4039a388d896d049f8d3be4f407.jpg",
        "https://i.pinimg.com/564x/5d/c3/b9/5dc3b9fb7c3590047762b26789d881fe.jpg",
        "https://i.pinimg.com/564x/ed/81/34/ed813438552d47fe4d9ffafca391174a.jpg",
        "https://i.pinimg.com/564x/b5/b2/0f/b5b20fd807a400bca3541a966e2becfd.jpg",
        "https://i.pinimg.com/564x/6b/d1/d9/6bd1d922a33706f99a3b4ddb32deae88.jpg",
        "https://i.pinimg.com/564x/22/1d/83/221d832d1ed39ac5fdc8d43f05e5d344.jpg",
        "https://i.pinimg.com/564x/f1/15/71/f1157164bd4803402019425aa73eb6ed.jpg",
    ]

    const randomImg = imageList[Math.floor(Math.random() * imageList.length)]
    console.log(randomImg)
    return randomImg
}

export default getRandomImage