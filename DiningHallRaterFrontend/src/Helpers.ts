// File for helper functions that may be used across application modules

// Abbreviates numbers above 999 into formats like 1.5K, 3M, etc.
export const shortenNumber = (number) => {
    const formatFunction = new Intl.NumberFormat(undefined, {
        notation: "compact",
        compactDisplay: "short"
    });

    return formatFunction.format(number);
}

// Calculate average rating given the number of ratings and a sum
export const calculateAverageRating = (numRatings, sumRatings) => {
    if (numRatings < 1) {
        return 0;
    }
    const averageRatingCalculation = sumRatings / numRatings;
    return parseFloat(averageRatingCalculation.toFixed(2));
}


