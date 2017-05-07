/**
 * Created by Erdem Celikten & Fabian Schweizer on 06.05.17.
 */

const apis = {
    audio: [],
    battery: null
};

const audioSuccess = function (localMediaStream) {
    const audioCtx = new AudioContext();
    const audioSrc = audioCtx.createMediaStreamSource(localMediaStream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    audioSrc.connect(analyser);
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const bins = [];
    let loop = true;
    frequencyData.forEach(function (e) {
        e = document.createElement('div');
        e.classList.add('bin');
        document.getElementById('bins').appendChild(e);
        bins.push(e);
    });

    setTimeout(() => {
        loop = false;
    }, 1800);

    function renderFrame() {
        analyser.getByteFrequencyData(frequencyData);
        apis.audio.push(frequencyData);
        frequencyData.forEach(function (data, index) {
            let width = '1px';
            if (data !== 0) {
                width = ((data * 100) / 256) + '%';
                // width = '400px';
            }
            bins[index].style.width = width;
        });
        if (loop) {
            requestAnimationFrame(renderFrame);
        } else {
            gameoflife();
        }
    }

    renderFrame();


    function gameoflife() {
        let cells = apis.audio;
        setInterval(() => {
            cells = apis.audio;
            apis.audio = draw(cells.map((row, rowIdx) => {
                return row.map((col, colIdx) => {
                    return check(rowIdx, colIdx);
                })
            }));
            console.log('loop');
        },200);

        function check(rI, cI) {
            let alive = 0;
            const neighbours = [
                [rI - 1, cI - 1],
                [rI - 1, cI],
                [rI - 1, cI + 1],
                [rI, cI - 1],
                [rI, cI + 1],
                [rI + 1, cI - 1],
                [rI + 1, cI],
                [rI + 1, cI + 1]
            ];
            neighbours.forEach((p) => {
                if (cells[p[0]] !== undefined && cells[p[0]][p[1]] !== 0) {
                    alive++;
                }
            });
            if (alive === 2 || alive === 3) {
                return 1;
            }
            return 0;
        }

        function draw(nc) {
            const bins = document.getElementById('bins');
            bins.innerHTML = '';
            nc.forEach((row, rI) => {
                const line = document.createElement('div');
                const id = `row${rI}`;
                line.id = id;
                line.classList.add('row');
                document.getElementById('bins').appendChild(line);
                row.forEach((col) => {
                    const dot = document.createElement('div');
                    if (col === 1) {
                        dot.classList.add('alive');
                    }
                    document.getElementById(id).appendChild(dot);
                });
            });
            return nc;
        }
    }


};

const audioFail = function () {
    console.log('Fail');
};

navigator.getUserMedia({audio: true}, function (localMediaStream) {
    audioSuccess(localMediaStream)
}, audioFail);