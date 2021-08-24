export function timelapse(node) {
    let duration: number;
    let paused: boolean = true;
    let currentTime: number = 0;
    let currentImage: string;
    let bufferedImages: Array<string>;

    function play(){
        paused = false;
    }
    function pause(){
        paused = true;
    }

    function handleMouseup(event) {
        console.log(event)
        node.dispatchEvent(new CustomEvent('lapseplaypause', {
            target: {play, pause}
        }));
        
    }
    function handleMousemove(event) {
        node.dispatchEvent(new CustomEvent('lapsemove'));
        console.log(currentTime);
    }

}
