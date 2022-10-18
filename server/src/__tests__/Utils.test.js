const { zipWith } = require('../Utils');

describe('tUtils', () => {

    test('zipWith should return an appropriate output', () => {

        const myFcn = (a, b) => [a, b];

        // --- When xs and ys has the same number of elements
        let xs = [1, 2, 3];
        let ys = [4, 5, 6];

        const actSameElems = zipWith(myFcn, xs, ys);
        expect(actSameElems).toEqual([
            [1, 4],
            [2, 5],
            [3, 6]
        ]);

        // --- When a number of Elements in xs of LESS than a number of element of ys
        xs = [1, 2];
        ys = [4, 5, 6];

        const actXsLessThanYs = zipWith(myFcn, xs, ys);
        expect(actXsLessThanYs).toEqual([
            [1, 4],
            [2, 5]
        ]);

        // --- When a number of Elements in xs of GREATER than a number of element of ys
        xs = [1, 2, 3];
        ys = [4];

        const actXsGtYs = zipWith(myFcn, xs, ys);
        expect(actXsGtYs).toEqual([
            [1, 4]
        ]);

    });

});