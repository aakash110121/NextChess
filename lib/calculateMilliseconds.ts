export function millisecondsToText(ms_passed:number): string {
    const ms = (2 * 24 * 60 * 60 * 1000) - ms_passed;
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
   

    const remainingDays = days;
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    if(remainingDays>0){
        return `${remainingDays} days, ${remainingHours} hours, ${remainingMinutes} minutes`;
     }
     else if(remainingHours>0){
        return `${remainingHours} hours, ${remainingMinutes} minutes`;
     }
     else if(remainingMinutes>0){
        return `${remainingMinutes} minutes`;
     }
     else return `${remainingSeconds} seconds`
}

