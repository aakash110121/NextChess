
export default function calculateDepth(rating: any, difficultyLevel: any){
   

    const plusNumber = 
    difficultyLevel==='Way worse than me' ? -750 :
    difficultyLevel==='Worse than me' ? -350 :
    difficultyLevel==='Same level as me' ? 0 :
    difficultyLevel==='Better than me' ? 200 :
    difficultyLevel==='Way better than me' ? 400 : 0;
    
 
    const targetedDepth = rating + plusNumber;
    
    let calculatedDepth = [0,0];
    if(targetedDepth<=200){
        calculatedDepth=[1,0.2];
    } 
    else if(targetedDepth<=300) {
        calculatedDepth=[1,0.3];
    }
    else if(targetedDepth<=400) {
        calculatedDepth=[1,0.4];
    }
    else if(targetedDepth<=500) {
        calculatedDepth=[1,0.5];
    }
    else if(targetedDepth<=600) {
        calculatedDepth=[1,0.6]
    }
    else if(targetedDepth<=700) {
        calculatedDepth=[1,0.65]
    }
    else if(targetedDepth<=800) {
        calculatedDepth=[1,0.7]
    }
    else if(targetedDepth<=900) {
        calculatedDepth=[1,0.8]
    }
    else if(targetedDepth<=1000) {
        calculatedDepth=[1,0.9]
    }
    else if(targetedDepth<=1200) {
        calculatedDepth=[1,1.0]
    }
    else if(targetedDepth<=1400) {
        calculatedDepth=[2,1.0]
    }
    else if(targetedDepth<=1600) {
        calculatedDepth=[3,1.0]
    }
    else if(targetedDepth<=1800) {
        calculatedDepth=[4,1.0]
    }
    else if(targetedDepth<=2000) {
        calculatedDepth=[5,1.0]
    }
    else if(targetedDepth<=2200) {
        calculatedDepth=[6,1.0]
    }
    else if(targetedDepth<=2400) {
        calculatedDepth=[7,1.0]
    }
    else if(targetedDepth<=2600) {
        calculatedDepth=[8,1.0]
    }
    else if(targetedDepth<=2800) {
        calculatedDepth=[9,1.0]
    }
    else if(targetedDepth<=3000) {
        calculatedDepth=[10,1.0]
    }

    return calculatedDepth;
}