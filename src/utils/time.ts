export function formatDate(date, separator = "/") {
    const day = `${date.getDate()}`.padStart(2, "0");
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const year = date.getFullYear();

    return day + separator + month + separator + year
}