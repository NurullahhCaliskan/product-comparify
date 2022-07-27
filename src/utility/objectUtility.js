export function cartesian(arr) {
    return arr.reduce(
        function (a, b) {
            return a
                .map(function (x) {
                    return b.map(function (y) {
                        return x.concat([y]);
                    });
                })
                .reduce(function (a, b) {
                    return a.concat(b);
                }, []);
        },
        [[]]
    );
}
