
/**
 * zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
 * @param {function} a function callback that takes in xs and ys
 * @param {[Number]} xs 
 * @param {[Number]} ys 
 * @returns 
 */
const zipWith = (f, xs, ys) => {
    const ny = ys.length;
    return (xs.length <= ny ? xs : xs.slice(0, ny))
        .map((x, i) => f(x, ys[i]));
}

/**
 * dotProduct :: [Int] -> [Int] -> Int
 * @param {[Number]} xs 
 * @param {[Number]} ys 
 * @returns 
 */
const dotProduct = (xs, ys) => {
    const sum = xs => xs ? xs.reduce((a, b) => a + b, 0) : undefined;

    return xs.length === ys.length ? (sum(zipWith((a, b) => a * b, xs, ys))) :
        undefined;
}


module.exports = {
    zipWith,
    dotProduct
}