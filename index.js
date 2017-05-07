/**
 * Created by fabianschweizer on 06.05.17.
 */

const apis = {
    audio: null,
    battery: null
};

const audioSuccess = function(localMediaStream) {
    var audioCtx = new AudioContext();
    var audioSrc = audioCtx.createMediaStreamSource(localMediaStream);
    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    audioSrc.connect(analyser);
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    const svg = d3.select('body').append('svg')
        .attr({
            height: "100vh",
            width: "100vw"
        });

    function renderFrame() {
        analyser.getByteFrequencyData(frequencyData);

        // scale things to fit
        var radiusScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([0, window.innerHeight/2 -10]);

        var hueScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([0, 360]);

        // update d3 chart with new data
        var circles = svg.selectAll('circle')
            .data(frequencyData);

        circles.enter().append('circle');

        circles
            .attr({
                r: function(d) { return radiusScale(d); },
                cx: window.innerWidth / 2,
                cy: window.innerHeight / 2,
                fill: 'none',
                'stroke-width': 3,
                'stroke-opacity': 0.3,
                stroke: function(d) { return d3.hsl(hueScale(d), 0.3, 0.5); }
            });

        circles.exit().remove();
        requestAnimationFrame(renderFrame);
    }
    renderFrame();


};

const audioFail = function() {
    console.log('Fail');
};

navigator.getUserMedia({audio: true}, function(localMediaStream) {audioSuccess(localMediaStream)}, audioFail);

// const battery = navigator.getBattery();
//
// if (battery) {
//     battery.then(
//         (batteryManager) => {
//             apis.battery = batteryManager;
//
//             const updateBattery = function(self, type) {
//                 console.log(self, type);
//             };
//
//             batteryManager.onchargingchange = function () {
//                 updateBattery(this, 'charging');
//             };
//             batteryManager.onchargingtimechange = function () {
//                 updateBattery(this, 'chargingtime');
//             };
//             batteryManager.ondischargingtimechange = function () {
//                 updateBattery(this, 'dischargingtime');
//             };
//             batteryManager.onlevelchange = function () {
//                 updateBattery(this, 'level');
//             };
//         }
//     );
// }
