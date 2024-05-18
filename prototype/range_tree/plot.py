import matplotlib.pyplot as plt

x_axis = [1000, 10900, 20800, 30700, 40600, 50500, 60400, 70300, 80200, 90100]
for i in range(len(x_axis)):
    x_axis[i] /= 1000

def generate_plot(title, data, path):
    # Generate a plot
    plt.figure(figsize=(10, 6))
    plt.plot(data["bin"], marker='o', linestyle='-', color='b', label='2D Binary Search')
    plt.plot(data["bst"], marker='o', linestyle='-', color='r', label='2D Range Tree')
    if "brute" in data:
        plt.plot(data["brute"], marker='o', linestyle='-', color='y', label='Bruteforce')
    
    # Adding title and labels
    plt.title(title)
    plt.xlabel('density (avg. points/row)')
    plt.ylabel('avg. time (ms)')
    
    # Adding a grid
    plt.grid(True)
    
    # Adding a legend
    plt.legend()

    plt.xticks(ticks=range(len(x_axis)), labels=x_axis)
    
    # Show the plot
    # plt.show()
    plt.savefig(path)

# Example usage
queryAll = {
  "bin": [
    62.57,  194.09,
    256.63, 334.32,
    416.09, 503.18,
    587.43, 693.34,
    789.06, 869.60
  ],
  "bst": [
    27.36,   213.77,
    402.90,  618.95,
    837.12,  1015.98,
    1308.97, 1484.18,
    1752.00, 1861.96
  ],
  # "brute": [
  #   56.43,   592.42,
  #   1103.66, 1630.07,
  #   2118.35, 2626.01,
  #   3154.76, 3666.20,
  #   4116.46, 4761.76
  # ]
}

queryExist = {
  "bin": [
    2.94, 1.85,
    1.70, 2.14,
    1.96, 1.82,
    1.93, 2.19,
    2.45, 2.48
  ],
  "bst": [
    4.13, 5.51,
    6.64, 8.00,
    7.98, 8.92,
    9.61, 9.98,
    9.93, 10.87
  ],
  # "brute": [
  #   3.49, 4.51,
  #   4.85, 5.60,
  #   5.40, 5.06,
  #   8.07, 6.09,
  #   5.39, 6.51
  # ]
}

queryBottomY = {
  "bin": [
    26.59,  81.68,
    97.41,  108.71,
    117.32, 131.78,
    137.24, 143.00,
    145.00, 153.01
  ],
  "bst": [
    11.73, 24.25,
    34.39, 41.22,
    59.29, 59.62,
    68.95, 82.27,
    80.24, 85.97
  ],
  # "brute": [
  #   54.45,   549.93,
  #   1026.68, 1504.12,
  #   1994.20, 2459.30,
  #   2910.42, 3355.08,
  #   3902.18, 4379.92
  # ]
}

queryLeftX = {
  "bin": [
    3.14, 1.71,
    1.75, 2.06,
    1.95, 2.62,
    2.34, 2.30,
    2.28, 2.20
  ],
  "bst": [
    3.74, 4.62,
    5.42, 6.04,
    6.29, 6.66,
    7.27, 7.86,
    8.09, 8.50
  ],
  # "brute": [
  #   55.60,   556.44,
  #   1037.82, 1546.86,
  #   1986.02, 2517.23,
  #   2963.87, 3434.92,
  #   3929.20, 4359.12
  # ]
}

generate_plot("queryAll benchmark", queryAll, "queryall")
generate_plot("queryExist benchmark", queryExist, "queryexist")
generate_plot("queryBottomY benchmark", queryBottomY, "querybottomy")
generate_plot("queryLeftX benchmark", queryLeftX, "queryleftx")


