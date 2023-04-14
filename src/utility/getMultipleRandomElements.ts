export default function getMultipleRandomElements(array: any[], count: number) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
  
    return shuffled.slice(0, count);
}