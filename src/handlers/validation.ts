// A function to test for bad input characters 

export const validate = async (input: string): Promise<boolean> => {
    const badChars_regex = /[\[\]\{\}\(\)\<\>\?\$\%\^\&\*\"]/;
    if (badChars_regex.test(input)) {
        return false;
    }
    else {
        return true;
    }
}