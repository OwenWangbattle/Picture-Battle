import cv2
import numpy as np
import json

import sys

def resize_image(image_path, width):
    # Load the image
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    
    # Calculate the aspect ratio
    aspect_ratio = width / float(image.shape[1])
    
    # Calculate the new height based on the aspect ratio
    height = int(image.shape[0] * aspect_ratio)
    
    # Resize the image
    resized_image = cv2.resize(image, (width, height))
    
    return resized_image

def extract_edges(image_path):
    # Load the image
    image = resize_image(image_path, 800)

    # Apply Canny edge detection
    edges = cv2.Canny(image, 100, 200)  # You can adjust the threshold values as needed

    # Find edge coordinates
    edge_points = np.transpose(np.nonzero(edges))  # Get the coordinates of non-zero (white) pixels

    # Create JSON object
    edge_info = {
        "image_path": image_path,
        "width": edges.shape[1],
        "height": edges.shape[0],
        "edges": edge_points.tolist()  # Convert NumPy array to list for JSON serialization
    }

    # Save processed image
    processed_image_path = image_path.replace(".", "_processed.")
    cv2.imwrite(processed_image_path, edges)

    return edge_info, processed_image_path

def save_as_json(data, json_path):
    with open(json_path, 'w') as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == "__main__":
    image_path = sys.argv[1]
    json_path = "edge_info.json"

    edge_info, processed_image_path = extract_edges(image_path)
    save_as_json(edge_info, json_path)

    print("Processed image saved to:", processed_image_path)
    print("Edge information saved to:", json_path)

