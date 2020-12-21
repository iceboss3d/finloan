export class Utility {
    randomNumber = (length: number): string => {
        let text: string = "";
        const possible = "123456789";
        for (let i = 0; i < length; i++) {
            let sup: number = Math.floor(Math.random() * possible.length);
            text += i > 0 && sup == i ? "0" : possible.charAt(sup);
        }
        return text;
    }
}