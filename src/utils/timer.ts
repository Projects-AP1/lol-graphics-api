export  const timer = (seconds: number) =>  {
    let time = seconds * 1000
    return new Promise(res => setTimeout(res, time))
}