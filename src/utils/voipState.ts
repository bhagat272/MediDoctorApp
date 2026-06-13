let isVoipCallAccepted = false;
 
export const setVoipCallAccepted = (value: boolean) => {
    isVoipCallAccepted = value;
};
 
export const getVoipCallAccepted = () => isVoipCallAccepted;
 
export const resetVoipCallAccepted = () => {
    isVoipCallAccepted = false;
};