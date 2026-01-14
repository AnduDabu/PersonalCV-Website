# prm_modular.py

import argparse
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
import time
from datetime import datetime
from PRMpathplanning import Node, bresenham, distance, line_in_obstacle


def generate_random_nodes(num_nodes, x_max, y_max, obstacle_map):
    nodes = []
    while len(nodes) < num_nodes:
        x = np.random.uniform(0, x_max)
        y = np.random.uniform(0, y_max)
        if obstacle_map[int(y), int(x)] > 200:
            nodes.append(Node(x, y))
    return nodes


def connect_nodes(nodes, k, obstacle_map):
    for node in nodes:
        distances = []
        for other_node in nodes:
            if node != other_node and not line_in_obstacle(node.x, node.y, other_node.x, other_node.y, obstacle_map):
                distances.append((distance(node, other_node), other_node))
        distances.sort(key=lambda x: x[0])
        for _, other_node in distances[:k]:
            node.add_edge(other_node)
            other_node.add_edge(node)


def a_star(start, goal, all_nodes):
    import heapq

    open_list = []
    heapq.heappush(open_list, (0, start))
    came_from = {}
    g_score = {node: float('inf') for node in all_nodes}
    g_score[start] = 0
    f_score = {node: float('inf') for node in all_nodes}
    f_score[start] = distance(start, goal)

    while open_list:
        _, current = heapq.heappop(open_list)

        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]

        for neighbor in current.edges:
            tentative_g_score = g_score[current] + distance(current, neighbor)
            if tentative_g_score < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = tentative_g_score + distance(neighbor, goal)
                heapq.heappush(open_list, (f_score[neighbor], neighbor))

    return None


def log_step(message, log_file):
    with open(log_file, 'a') as f:
        f.write(f"[{datetime.now()}] {message}\n")


def save_plot(nodes, path, obstacle_map, output_path):
    plt.figure()
    if obstacle_map is not None:
        plt.imshow(obstacle_map, cmap='gray', origin='lower')

    for node in nodes:
        for edge in node.edges:
            plt.plot([node.x, edge.x], [node.y, edge.y], 'k-', lw=0.5)

    if path:
        path_x = [node.x for node in path]
        path_y = [node.y for node in path]
        plt.plot(path_x, path_y, 'r-', lw=2)

    plt.scatter([node.x for node in nodes], [node.y for node in nodes], c='b')
    if path:
        plt.scatter([path[0].x], [path[0].y], c='g', marker='o')
        plt.scatter([path[-1].x], [path[-1].y], c='r', marker='x')
    plt.savefig(output_path)
    plt.show()
    plt.close()


def main():
    parser = argparse.ArgumentParser(description="PRM Path Planning")
    parser.add_argument('--image', type=str, required=True, help='Path to the map image')
    parser.add_argument('--nodes', type=int, default=100, help='Number of random nodes')
    parser.add_argument('--neighbors', type=int, default=5, help='Number of neighbors to connect')
    parser.add_argument('--log', type=str, default='prm_log.txt', help='Log file')
    parser.add_argument('--output', type=str, default='output.png', help='Output image file')
    args = parser.parse_args()

    # Load and prepare the map
    original_image = Image.open(args.image).convert('L')
    obstacle_map = np.array(original_image)
    y_max, x_max = obstacle_map.shape

    log_step("Image loaded", args.log)

    # Let user click start and goal
    plt.imshow(obstacle_map, cmap='gray', origin='lower')
    plt.title("Click START and GOAL")
    points = plt.ginput(2)
    plt.close()

    start = Node(*points[0])
    goal = Node(*points[1])
    log_step(f"Start: {points[0]}, Goal: {points[1]}", args.log)
    
    # Generate and connect nodes
    nodes = [start] + generate_random_nodes(args.nodes, x_max, y_max, obstacle_map) + [goal]
    connect_nodes(nodes, args.neighbors, obstacle_map)
    log_step("Nodes generated and connected", args.log)

    # Run A*
    path = a_star(start, goal, nodes)
    if path:
        log_step(f"Path found with {len(path)} steps", args.log)
    else:
        log_step("No path found", args.log)

    # Save the output image
    save_plot(nodes, path, obstacle_map, args.output)
    log_step(f"Image saved to {args.output}", args.log)


if __name__ == '__main__':
    main()