import numpy as np
from HM1_Convolve import Gaussian_filter, Sobel_filter_x, Sobel_filter_y
from utils import read_img, write_img


def compute_gradient_magnitude_direction(x_grad, y_grad):
    """
        The function you need to implement for Q2 a).
        Inputs:
            x_grad: array(float)
            y_grad: array(float)
        Outputs:
            magnitude_grad: array(float)
            direction_grad: array(float) you may keep the angle of the gradient at each pixel
    """
    magnitude_grad = np.sqrt(x_grad**2 + y_grad**2)
    direction_grad = np.arctan2(x_grad, y_grad)
    return magnitude_grad, direction_grad


def non_maximal_suppressor(grad_mag, grad_dir):
    """
        The function you need to implement for Q2 b).
        Inputs:
            grad_mag: array(float)
            grad_dir: array(float)
        Outputs:
            output: array(float)
    """
    gradbefore = grad_mag

    def Blinterporation(grad, x, y):

        x1 = np.floor(x).astype(int)
        y1 = np.floor(y).astype(int)
        x2 = x1 + 1
        y2 = y1 + 1
        x1 = np.where(x1 > grad.shape[0] - 1, grad.shape[0] - 1, x1)
        x1 = np.where(x1 < 0, 0, x1)
        y1 = np.where(y1 > grad.shape[1] - 1, grad.shape[1] - 1, y1)
        y1 = np.where(y1 < 0, 0, y1)
        x2 = np.where(x2 > grad.shape[0] - 1, grad.shape[0] - 1, x2)
        x2 = np.where(x2 < 0, 0, x2)
        y2 = np.where(y2 > grad.shape[1] - 1, grad.shape[1] - 1, y2)
        y2 = np.where(y2 < 0, 0, y2)

        Answer = ((y2 - y) * (x2 - x) * grad[x1, y1] +
                  (x - x1) * (y2 - y) * grad[x2, y1] +
                  (x2 - x) * (y - y1) * grad[x1, y2] +
                  (x - x1) * (y - y1) * grad[x2, y2])
        return Answer

   # forward gradient magnitude
    imgy1, imgx1 = np.meshgrid(
        np.arange(grad_mag.shape[1]), np.arange(grad_mag.shape[0]))
    x1 = (imgx1 + grad_dir * np.cos(grad_dir))
    y1 = (imgy1 + grad_dir * np.sin(grad_dir))
    gradfront_mag = Blinterporation(grad_mag, x1, y1)

    # backward gradient magnitude
    imgy2, imgx2 = np.meshgrid(
        np.arange(grad_mag.shape[1]), np.arange(grad_mag.shape[0]))
    x2 = imgx2 - grad_dir * np.cos(grad_dir)
    y2 = imgy2 - grad_dir * np.sin(grad_dir)
    gradback_mag = Blinterporation(grad_mag, x2, y2)

    # NMS
    grad_mag[((gradbefore < gradback_mag) | (gradbefore < gradfront_mag))] = 0
    NMS_output = grad_mag

    return NMS_output


def hysteresis_thresholding(img):
    """
        The function you need to implement for Q2 c).
        Inputs:
            img: array(float)
        Outputs:
            output: array(float)
    """

    # you can adjust the parameters to fit your own implementation
    # I use DFS to link the edges.
    def DFS(img, array, i, j):
        for x in range(i - 1, i + 2):
            for y in range(j - 1, j + 2):
                if ((x < 0) | (y < 0) | (x >= img.shape[0]) |
                   (y >= img.shape[1])):
                    continue
                elif (array[x, y] == 1):
                    continue
                else:
                    if low_ratio * Max <= img[x, y] <= high_ratio * Max:
                        array[x, y] = 1
                        img[i, j] = Max
                        DFS(img, array, x, y)
        return

    low_ratio = 0.1
    high_ratio = 0.3
    Max = np.max(img)
    array = np.zeros(img.shape)

    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            if (array[i, j] == 1):
                continue
            if img[i, j] > high_ratio * Max:
                array[i, j] = 1
                img[i, j] = Max
                DFS(img, array, i, j)
            elif img[i, j] < low_ratio * Max:
                array[i, j] = 1
                img[i, j] = 0

    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            if img[i, j] <= high_ratio * Max:
                img[i, j] = 0

    output = img
    return output


if __name__ == "__main__":

    # Load the input images
    input_img = read_img("lenna.png")/255

    # Apply gaussian blurring
    blur_img = Gaussian_filter(input_img)

    x_grad = Sobel_filter_x(blur_img)
    y_grad = Sobel_filter_y(blur_img)

    # Compute the magnitude and the direction of gradient
    magnitude_grad, direction_grad = compute_gradient_magnitude_direction(
        x_grad, y_grad)

    # NMS
    NMS_output = non_maximal_suppressor(magnitude_grad, direction_grad)

    # Edge linking with hysteresis
    output_img = hysteresis_thresholding(NMS_output)

    write_img("result/HM1_Canny_result.png", output_img*255)
