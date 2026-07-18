(function ($) {
  if ($(".chart-container").length) {
    // Select the chart container
    const chartContainer = document.querySelector(".chart-container");

    // Get data attributes and parse them
    const labels = JSON.parse(chartContainer.getAttribute("data-labels"));
    const data = JSON.parse(chartContainer.getAttribute("data-data"));

    const myChart = document.querySelector(".skill-two__chart");

    new Chart(myChart, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          label: false,
          data: data,
        }],
      },
      options: {
        borderWidth: 2,
        borderRadius: 2,
        hoverBorderWidth: 0,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
})(jQuery);