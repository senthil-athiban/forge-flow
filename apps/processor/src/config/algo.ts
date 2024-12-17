export const processContent = (type: string, content:any, jsonContent:any) => {
    

    if(type === "email") {
        const body = content.body;
        const email = content.email;
        const formatedBody = extract(body, jsonContent);
        const formatedEmail = extract(email, jsonContent);
        return { to: formatedEmail, content: formatedBody};
    }

    if(type === "sol") {
        const address = content.address;
        const amount = content.amount;
        const formatedAddress = extract(address, jsonContent);
        const formatedAmount = extract(amount, jsonContent);
        return { address: formatedAddress, amount: formatedAmount};
    }
    
}

const extract = (sentence:any, json:any) => {
    let idx = 0;
    const len = sentence.length;
    let formatedSentence = sentence;
    while(idx < len) {
        const char = sentence.charAt(idx);
        if(char === "{") {
            let j = idx;
            let str = '';
            let ch = sentence.charAt(j);
            while(ch !== "}") {
                ch = sentence.charAt(j);
                str += ch;
                j++;
                idx++;
            } 
            str = str.substring(1, str.length-1);
            const jsonContent = json.body;
            const first = str.split('.')[1];
            const originalContent = jsonContent[first];
            formatedSentence = formatedSentence.replace(`{${str}}`, originalContent);
        }
        idx++;
    }
    return formatedSentence;
} 