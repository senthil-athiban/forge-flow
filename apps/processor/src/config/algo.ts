export const processContent = (content:any, jsonContent:any) => {
    const body = content.body;
    const email = content.email;

    const formatedBody = extract(body, jsonContent);
    const formatedEmail = extract(email, jsonContent);
    return { to: formatedEmail, content: formatedBody};
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