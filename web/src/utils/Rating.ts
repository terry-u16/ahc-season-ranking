export const getColorClassName = (
  rating: number,
):
  | 'user-unrated'
  | 'user-grey'
  | 'user-brown'
  | 'user-green'
  | 'user-cyan'
  | 'user-blue'
  | 'user-yellow'
  | 'user-orange'
  | 'user-red' => {
  if (rating <= 0) {
    return 'user-unrated';
  } else if (rating < 400) {
    return 'user-grey';
  } else if (rating < 800) {
    return 'user-brown';
  } else if (rating < 1200) {
    return 'user-green';
  } else if (rating < 1600) {
    return 'user-cyan';
  } else if (rating < 2000) {
    return 'user-blue';
  } else if (rating < 2400) {
    return 'user-yellow';
  } else if (rating < 2800) {
    return 'user-orange';
  } else {
    return 'user-red';
  }
};

export const convertPerformanceFromInner = (
  innerPerformance: number,
): number => {
  // https://www.dropbox.com/s/ne358pdixfafppm/AHC_rating.pdf?e=1&dl=0
  if (innerPerformance >= 400) {
    return innerPerformance;
  } else {
    // いろいろ見る限り四捨五入ではなく切り捨てをしているっぽいけどよく分からない
    return Math.floor(400 / Math.exp((400 - innerPerformance) / 400));
  }
};
