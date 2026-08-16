# Introduction 
For third year we had a robotics module, with the coursework of completing their 5 labs. Now, in a cool world this would be building actual robots. Instead we just did different simulations making use of Python and Robot Operating System (ROS). This was a frustrating coursework as the virtual environment would keep closing and requiring memory purges - it was just very slow and uninteresting. 

# Task 1
This task was an introductory lab to introduce us to the virtual environment and ROS2. We first configure and boot up the venv on our machine. Next we create the hello world package with 
```bash
ros2 pkg create -- build - type ament_python r2
```
We then use what is setup to create a simple program that outputs "Hello World" to the console log. 
```python
import rclpy
from rclpy.node import Node

rclpy.init(args = None)
node = Node('printer_node') # Note that there should have no space in node name
node.get_logger().info('HELLO WORLD - ROS2')
rclpy.spin(node)
node.destroy_node()
rclpy.shutdown()
```

Then we go and run the program with the following commands:
```bash
cd ~/ros2_ws
colcon build --packages-select r2
source install/local_setup.bash
ros2 run r2 prt

cd ~/ros2_ws
colcon build --packages-select r2
source install/local_setup.bash
ros2 launch r2 node_launcher.launch.py
```
This creates a very simple workspace, which will run the hello world package.

Now we have a basic workspace, we go to expand upon this with a publisher node and a subscriber node. The publisher (pub) should publish a series of messages to a topic; the subscriber (sub) should subscribe to the topic, and listen to the messages, printing them out on screen. As a prerequisite, we first make the publisher and subscriber nodes as `publisher.py` and `subscriber.py`. 
```python
# publisher.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class PublisherNode(Node):
    def __init__(self):
        super().__init__('topic_publisher')
        self.publisher_ = self.create_publisher(String, 'phrases', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    publisher_node = PublisherNode()
    rclpy.spin(publisher_node)
    publisher_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

```python
# subscriber.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class SubscriberNode(Node):
    def __init__(self):
        super().__init__('topic_subscriber')
        self.subscription = self.create_subscription(
            String,
            'phrases',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info('I heard: "%s"' % msg.data)

def main(args=None):
    rclpy.init(args=args)
    subscriber_node = SubscriberNode()
    rclpy.spin(subscriber_node)
    subscriber_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

We first create a single launch file called `pubsub_launcher.launch.py` which contains both the pub and the sub.
```python
import launch
import launch_ros.actions

def generate_launch_description():
  return launch.LaunchDescription([
    launch_ros.actions.Node(
      package='r2',
      executable='pub',
      output='screen',
      name='custom_py_node_name'
    ),
    launch_ros.actions.Node(
      package='r2',
      executable='sub',
      output='screen',
      name='custom_py_node_name'
    )

  ])
```
We then run this with 
```bash
ros2 launch r2 pubsub_launcher.launch.py
```
Which produces the following output:

![Screenshot of the output of pubsub_launcher.launch.py](./md/images/ss1.png)
*Screenshot of the output of `pubsub_launcher.launch.py`*

# Task 2
This next lab was to actually achieve some simulation with ROS, which we would achieve with the TurtleBot. Firstly, we were to go and understand out publisher-subscriber architecture a little better. We can do this with TurtleSim. We first setup in one terminal:
```bash
ros2 run turtlesim turtlesim_node
```
and in another
```bash
ros2 run turtlesim turtle_teleop_key
```
Which we can then explore the info about the nodes with:
```bash
ros2 topic list
ros2 topic info /turtle1/pose
ros2 interface show turtlesim/msg/Pose
ros2 topic echo /turtle1/cmd_vel # display the data being published on a topic
```
We want to visualise these nodes and their relationships with an RQT graph (ROS QT Graph), which is dynamic to show what is currently ongoing in the system. 
```bash
ros2 run rqt_graph rqt_graph
```
Our task was to create an RQT graph for 4 turtle nodes: A and B (turtlesim\_nodes) and C and D (turtle\_teleop\_keys). The graph itself is a bit of a confusing mess with all the text, but it basically shows how the nodes interact with the keys.
![Screenshot of the RQT Graph of A,B,C and D](./md/images/ss2.png)
*Screenshot of the RQT Graph of A,B,C and D.*

Next we are to actually use the turtles, with out next task to call the `spawn` service to have a new turtle at different positions; then the `reset` service to reset the simulation. Next we use `teleport_relative` (which teleports the turtle relative to its current position) or `teleport_absolute` (which teleports the turtle in the absolute world space) to move the turtlebot. Finally we change the background of the turtlesim using a parameter we pass in. 

`teleport_relative`
```bash
ros2 service call /turtle1/teleport_relative turtlesim/srv/TeleportRelative `{linear: 2.5, angular: 3.1}'
```
![Turtle relative teleport](./md/images/t1.png)
*Turtle relative teleport.*

`teleport_absolute`
```bash
ros2 service call /turtle1/teleport_absolute turtlesim/srv/TeleportAbsolute '{x: 1.0, y: 3.0, theta: 0.0}'
```
![Turtle absolute teleport](./md/images/t2.png)
*Turtle absolute teleport.*

Background color change 
```bash
ros2 param set /turtlesim background_r 255
ros2 param set /turtlesim background_b 0
ros2 param set /turtlesim background_g 0
```
![Turtle background color change](./md/images/t3.png)
*Turtle background color change.*

With some basic movements setup, we now turned to look at how to use Turtlebot3, which is the 'robot' used throughout the course. It is a single board computer, with a laser sensor, control board, actuators (dynamixel series) and can be customised to support other sensors. We install it with:
```bash
sudo apt-get install ros-foxy-turtlebot3*
```
We then simulate the development environment with RViz, a powerful 3D visualisation tool in ROS, allowing us to view the simulated robot model, log sensor information, and replay said logged info. To launch it in RViz and drive it with the keyboard we use:
```bash
ros2 launch turtlebot3_fake_node turtlebot3_fake_node.launch.py
ros2 run turtlebot3_teleop teleop_keyboard
```
This lets us use W/X to make it go forward/backward, A/D to rotate it left or right, and S to reset translation. This is cool and all, but we want to program the movement. Specifically the task makes us want the robot to drive in a circle. We define a new file `trajectory.py` which uses the code below. We Specify the linear velocity in the x direction to always be moving forward, and the angular velocity to be a fixed 1 as well. This means it will always be moving forward and turning slightly left. The values didn’t really matter so long as they were small enough to be visible on screen, so setting them both to 1 seemed to work. This can be envisioned as moving a vector slightly to the left of where the robot is facing each time, making it go round in a circle.
```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

class Mover(Node):
    def __init__(self):
        super().__init__('vel_publisher')
        self.publisher_ = self.create_publisher(Twist, 'cmd_vel', 10)
        self.timer_ = self.create_timer(1.0, self.timer_callback)
        self.i = 0
        self.get_logger().info("Press CTRL + C to terminate")

    def timer_callback(self):
        msg = Twist()
        msg.linear.x = 1.0
        msg.angular.z = 1.0

        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg)

def main(args=None):
    rclpy.init(args=args)
    mover = Mover()
    rclpy.spin(mover)
    mover.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

![Turtle turning in a circle in RViz](./md/images/c1.png)
*Turtle turning in a circle in RViz.*

# Task 3
The next lab was focused upon motion, specifically with the Turtlebot3 and its modes of motion capabilities. The Turtlebot3 robot is a differential wheeled robot. Though multiple layers of plates/sensors are placed on top of the robot, the kinematics of the robot can be simplified according to the property of its mobile base, which uses differential drive for locomotion. The differential mobile base has two powered wheels, located symmetrically about its center. We send high-level commands of linear velocity $v$ and angular velocity $\omega$, which transform the robot with respect to the robot center into the desired rotational speed of each wheel, and then control the rotational speed by a feedback control of the current of the motor that drives the wheel. To describe the position and orientation of the robot we attach a robot coordinate frame $R$ to it. The $X$ axis of the frame is pointing forward, the $Y$ axis pointing to the left, and the $Z$ axis pointing up. For our purposes, we constrain the robot's position to a plane of frame $W$, so the position of the robot with respect to world reference frame has the form:
$$
P_W = \begin{bmatrix}
x \\\\
y \\\\
0
\end{bmatrix}
$$
To describe the orientation of the robot frame $R$ with respect to the world frame $W$ we use the rotation matrix:
$$
R_{WR} = \begin{bmatrix}
\cos{\phi} & -\sin{\phi} & 0 \\\\
\sin{\phi} & \cos{\phi} & 0 \\\\
0 & 0 & 1 
\end{bmatrix}
$$

All of that yap is to give context to this lab's task. Here we must use the knowledge of ROS Node, Topic and Publisher, to write a script to drive the Turtlebot to move in a square shape in Gazebo - a different visualiser to RViz. We are to have it visit $[4,0], [4,4], [0,4], [0,0]$, so it moves forward 4 meters, turns left 90 degrees, moves forward 4 meters and so on until back to the origin. 

The program to drive the robot in a square is below. What this does is go between the two states of moving forward and turning. It does each instruction in a series of steps, which it checks when it has reached its target. So while the robot is moving forward, it does so until its done 4 steps, then sets linear speed to 0, and angular speed to $\pi/20$. Then it turns until it has done 10 turn phases, and sets angular velocity to zero, and resumes going forward. The reason we do this rather than one large step, is that it loses a lot of accuracy when done in one second, so by slowing it down it performs far better. When it finally has turned 4 times, it must be back to the start, so we tell it to stop by setting all speeds across all dimensions to 0. 
```python
from typing import List
import rclpy
from rclpy.context import Context
from rclpy.node import Node
from geometry_msgs.msg import Twist
from rclpy.parameter import Parameter
from math import pi

class Mover(Node):
    def __init__(self, node_name: str = 'mover'):
        super().__init__(node_name=node_name)
        self.publisher_ = self.create_publisher(Twist, 'cmd_vel', 10)
        self.timer_ = self.create_timer(1.0, self.timer_callback)  # 1.0s period, 1Hz
        self.i = 0
        self.step = 1
        self.turning = False
        self.turns = 0
        msg = Twist()
        msg.linear.x=1.0
        msg.angular.z = 0.0
        self.publisher_.publish(msg)
        self.get_logger().info('Mover has been initialized.')

    def timer_callback(self):
        if self.turns < 4:
            if not self.turning:
                self.get_logger().info("Not turning")
                if (self.step % 4) == 0:
                    msg = Twist()
                    msg.linear.x = 0.0
                    msg.angular.z = pi/20
                    self.publisher_.publish(msg)
                    self.turning=True
                    self.step=0
            else:
                self.get_logger().info("Turning")
                if (self.step % 10) == 0:
                    msg = Twist()
                    msg.linear.x = 1.0
                    msg.angular.z = 0.0
                    self.publisher_.publish(msg)
                    self.turning=False
                    self.step=0
                    self.turns += 1
    
            self.step += 1
        else:
            msg = Twist()
            msg.linear.x=0.0
            msg.angular.z=0.0
            self.publisher_.publish(msg)


def main(args=None):
    rclpy.init(args=args)
    mover = Mover()
    rclpy.spin(mover)
    mover.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

![Turtle moving in a square in Gazebo part 1](./md/images/w1.png)
![Turtle moving in a square in Gazebo part 2](./md/images/w2.png)
![Turtle moving in a square in Gazebo part 3](./md/images/w3.png)
![Turtle moving in a square in Gazebo part 4](./md/images/w4.png)
*Turtle moving in a square in Gazebo*

This basic movement in this simulated environment neglects the motion uncertainty present within actual robot movement. The way we can add this in is applying a small amount of noise to the robot. We do this with independent Gaussian's on the linear and angular velocity. Our code works by linking to this second channel that our move script now publishes to, and adding noise to the linear and angular speed in the x and z axis. This message is then published to the original channel which Gazebo finds. We add Gaussian noise using the function that was given, and this skews how the robot moves. 
```python
import numpy as np
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from rclpy.parameter import Parameter

class AddMotionNoise(Node):
    def __init__(self):
        super().__init__('add_motion_noise')

        self.declare_parameter('linear_noise', value=0.001)
        self.declare_parameter('angular_noise', value=0.001)
        self.declare_parameter('topic_name', value='cmd_vel')

        self.linear_noise = self.get_parameter('linear_noise').get_parameter_value().double_value
        self.angular_noise = self.get_parameter('angular_noise').get_parameter_value().double_value
        self.topic_name = self.get_parameter('topic_name').get_parameter_value().string_value
        
        self.get_logger().info('linear_noise: %s' % self.linear_noise)
        self.get_logger().info('angular_noise: %s' % self.angular_noise)
        self.get_logger().info('topic_name: %s' % self.topic_name)
        
        self.publisher_ = self.create_publisher(Twist, self.topic_name, 10)
        self.subscription_ = self.create_subscription(Twist, 'cmd_vel_2', self.cmd_vel_callback, 10)

        self.subscription_  # prevent unused variable warning
        self.get_logger().info('AddMotionNoise has been initialized.')

    def cmd_vel_callback(self, msg: Twist):
        msg.linear.x += np.random.normal(0.0, self.linear_noise)
        msg.angular.y += np.random.normal(0.0, self.angular_noise)
        
        self.publisher_.publish(msg)

def main(args=None):
    rclpy.init(args=args)
    add_motion_noise = AddMotionNoise()
    rclpy.spin(add_motion_noise)
    add_motion_noise.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```
For the task, we had to painstakingly run 3 experiments, where each time we drive the robot with different amount of noise. Experiment 1 had no noise, Experiment 2 had (0.02, 0.01) and Experiment 3 had (0.1, 0.05) for the variance of linear noise x and angular noise y respectively. We then had to record the x,y coordinates of each at the end of the loop to see how far they are from the origin. This was frustratingly long oh my days.

| Experiment 1 ($x$) | Experiment 1 ($y$) | Experiment 2 ($x$) | Experiment 2 ($y$) | Experiment 3 ($x$) | Experiment 3 ($y$) |
| --- | --- | --- | --- | --- | --- |
| -0.237433 | -0.036795 | 0.280984 | 0.384369 | 3.660754 | -1.018051 |
| -0.071271 | 0.135553 | -0.835704 | -0.006449 | -1.464195 | 0.668452 |
| -0.057768 | 0.309637 | 1.233326 | 0.172379 | 3.447702 | -0.535885 |
| -0.360871 | 0.406785 | -0.343344 | 0.820547 | 0.663402 | 1.664127 |
| -0.621765 | 0.263237 | 0.669089 | -0.479224 | 4.312932 | -1.914546 |
| -0.208546 | 0.266764 | -1.263189 | 0.786679 | -4.091486 | -1.401135 |
| -0.218563 | 0.309677 | 1.0102266 | -0.469711 | 0.414391 | -0.270192 |
| -0.259207 | 0.219040 | -0.359926 | 0.710330 | -3.269972 | 1.807097 |
| -0.256795 | 0.260734 | -0.641655 | -0.387867 | 0.240905 | -3.192771 |
| -0.206780 | 0.265211 | -0.578074 | 0.332972 | 3.087353 | -1.083177 |

We used these results to calculate the covariance matrices for each experiment, which uses the following formula:
$$
\Sigma = \frac{1}{N}\begin{bmatrix}
\sum_{i=1}^N (x_i - \bar{x})^2 & \sum_{i=1}^N (x_i - \bar{x})(y_i - \bar{y}) \\\\
\sum_{i=1}^N (x_i - \bar{x})(y_i - \bar{y}) & \sum_{i=1}^N (y_i - \bar{y})^2 
\end{bmatrix}
$$
where $\bar{x}$ and $\bar{y}$ are the mean end locations. We are also tasked to calculate the scatter ranges, which are just the standard deviation of the x and y coords respectively.

Experiment 1:
$$
\Sigma = \frac{1}{N}\begin{bmatrix}
0.0224 & -0.0031 \\\\
-0.0031 & 0.0128
\end{bmatrix}, \text{ scatter range } = (0.1498, 0.1131)
$$

Experiment 2:
$$
\Sigma = \frac{1}{N}\begin{bmatrix}
0.6056 & -0.1897 \\\\
-0.1897 & 0.2340
\end{bmatrix}, \text{ scatter range } = (0.7782, 0.4837)
$$

Experiment 3:
$$
\Sigma = \frac{1}{N}\begin{bmatrix}
8.8164 & -2.2591 \\\\
-2.2591 & 2.5518
\end{bmatrix}, \text{ scatter range } = (2.9692, 1.5974)
$$

There are several methods we could use to reduce the scatter score. Since the robot is being impacted by linear and angular noise, we can look how we mitigate each. Linear noise only significantly affects the turning phase, and this can be reduced by more frequent steps which keep the linear speed at 0. Angular noise meanwhile impacts when we are not turning. It is most impactful when we are moving very fast as we move as sharper angles, hence we can reduce the speed. Additionally we can have more frequent steps which ensure the robot has angular speed at 0. There may be other small changes we can make as well, such as finding methods to reduce the disruption caused by the noise, such as anticipating the noise in advance.

# Task 4
Since we have seen that simply applying velocity commands to drive the robot won't always produce accurate motion as desired, we now explore closed-loop control. Previously we did an open-loop controller, specifying velocity for a certain period to control motion.

![Closed-loop controller diagram](./md/images/feedback_block.png)
*Closed-loop controller diagram.*

- Reference $r$ - desired state we want the robot to reach, consider 2D robot pose $(x, y, \phi)$.
- Error $e$ - difference between the desired reference $r$ and the actual output $y$.
- Controller $C(S)$ - what we need to design, its what provides the control signal that impacts the system. 
- Control Input $u$ - the velocity command we send to the robot. 
- Plant $P(S)$ - the system we would like to control.
- Control Output $y$ - the current robot state.

Now $u$ is a function of time $t$ and is computed as:
$$
u(t) = k_p e(t) + k_i \int e(t) dt + k_d \frac{de(t)}{dt}
$$
This describes the nature of the Proportional-Integral-Derivative (PID) controller. This uses the proportional term, the integral term and the derivative term. The idea is to use the error to dynamically adjust the control $u$ given time $t$. $k_p$, $k_i$ and $k_d$ are terms to tune the error, which impacts error, steady-state error, and settling time respectively. 

In practice, choosing the optimal values of gains for PID controller with non-linear system is always a hard problem. In math, it has rigorous analysis to show the stability and convergence of the system, which can be used to calculate the optimal parameters. However, in this lab manually tuned non-optimal parameters are sufficient to complete the task. Now since we consider a discrete time system, we replace the integral with summation, and the derivative with subtraction:
$$
u(t) = k_p e(t) + k_i \sum e(t) dt + k_d \frac{e(t) - e(t-\Delta t)}{\Delta t}
$$ 
For simplicity, this lab drops the integral term,and focuses on the PD controller. Our task was to build the controller class.

```python
class Controller:
    def __init__(self, P=0.0, D=0.0, set_point=0):
        self.Kp = P
        self.Kd = D
        self.set_point = set_point # reference (desired value)
        self.previous_error = 0

    def update(self, current_value):
        # calculate P_term and D_term
        error = self.set_point - current_value
        P_term = self.Kp * error
        D_term = self.Kd * (error-self.previous_error)
        self.previous_error = error
        return P_term + D_term

    def setPoint(self, set_point):
        self.set_point = set_point
        self.previous_error = 0
    
    def setPD(self, P=0.0, D=0.0):
        self.Kp = P
        self.Kd = D
```

Following on from this, we need to implement a PD controller to track the square shape trajectory, the same as task 3. We need to track the error for the pose $(x,y,\phi)$. The general implementation is as such:
1. Assume robot's current pose is $(x,y,\phi)$ and that the target pose is $(x^\*, y^\*, \phi^\*)$
2. Calculate the moving direction from the difference between $(x,y)$ and $(x^\*,y^\*)$, this is the desired orientation $\phi^\*$
3. Initialize a PD controller with the setpoint $\phi^\*$ and parameters $k_p$ amd $k_d$. Use the PD controller to adjust the orientation of the robot with appropriate angular velocity.
4. Once you reach $\phi^\*$, move robot forward with open-loop control (or closed-loop if fancy). As we go, keep adjusting the angle and checking the remaining distance toward the required position. 

```python
from math import pi, sqrt, atan2, cos, sin
import numpy as np
import threading

import rclpy
from tf_transformations import euler_from_quaternion
from std_msgs.msg import Empty
from nav_msgs.msg import Odometry
from geometry_msgs.msg import Twist, Pose2D

class Controller:
    def __init__(self, P=0.0, D=0.0, set_point=0):
        self.Kp = P
        self.Kd = D
        self.set_point = set_point # reference (desired value)
        self.previous_error = 0

    def update(self, current_value):
        # calculate P_term and D_term
        error = self.set_point - current_value
        P_term = self.Kp * error
        D_term = self.Kd * (error-self.previous_error)
        self.previous_error = error
        return P_term + D_term

    def setPoint(self, set_point):
        self.set_point = set_point
        self.previous_error = 0
    
    def setPD(self, P=0.0, D=0.0):
        self.Kp = P
        self.Kd = D

class Turtlebot3():
    def __init__(self):
        rclpy.init()
        self.node = rclpy.create_node("turtlebot3_move_square")
        self.node.get_logger().info("Press Ctrl + C to terminate")
        self.vel_pub = self.node.create_publisher(Twist, "cmd_vel", 10)
        self.rate = self.node.create_rate(10)

        t = threading.Thread(target=rclpy.spin, args=(self.node,), daemon=True)
        t.start()

        # subscribe to odometry
        self.pose = Pose2D()
        self.logging_counter = 0
        self.trajectory = list()
        self.odom_sub = self.node.create_subscription(Odometry, "odom", self.odom_callback, 10)

        self.goals = [[4,0], [4,4], [0,4], [0,0]]

        try:
            self.run()
        except KeyboardInterrupt:
            print('Interrupted')
        finally:
            # save trajectory to csv file
            np.savetxt('trajectory.csv', np.array(self.trajectory), delimiter=',')
            self.node.destroy_node()
            rclpy.shutdown()

    def run(self):
        pd = Controller(P=0.8, D=0.6)
        i = 0

        while i<4:
            goal = self.goals[i]
            
            distance = np.sqrt((self.pose.x - goal[0])**2 + (self.pose.y-goal[1])**2)
            if distance < 0.1:
                i+=1

            target = self.target_theta(self.pose.x, self.pose.y, goal[0], goal[1])
            pd.setPoint(self.normalize_theta(target, goal))
            msg = Twist()
            msg.linear.x=0.4
            msg.angular.z = pd.update(self.normalize_theta(self.pose.theta, goal))
            self.vel_pub.publish(msg)
            self.node.get_logger().info(str(distance))

        msg = Twist()
        msg.linear.x=0.0
        msg.angular.z=0.0
        self.vel_pub.publish(msg)

    def target_theta(self, x1, y1, x2, y2):
        return np.arctan2(y2-y1, x2-x1)

    def normalize_theta(self, theta, goal):
        if goal[0]==0 and goal[1] == 4:
            while theta < 0:
                theta += 2*np.pi 
            return theta
        else:
            return theta
    
    def odom_callback(self, msg):
        # get pose = (x, y, theta) from odometry topic
        quaternion = [msg.pose.pose.orientation.x,msg.pose.pose.orientation.y,\
                    msg.pose.pose.orientation.z, msg.pose.pose.orientation.w]
        (roll, pitch, yaw) = euler_from_quaternion(quaternion)
        self.pose.theta = yaw
        self.pose.x = msg.pose.pose.position.x
        self.pose.y = msg.pose.pose.position.y

        # logging once every 100 times (Gazebo runs at 1000Hz; we save it at 10Hz)
        self.logging_counter += 1
        if self.logging_counter == 100:
            self.logging_counter = 0
            self.trajectory.append([self.pose.x, self.pose.y])  # save trajectory
            self.node.get_logger().info("odom: x=" + str(self.pose.x) +\
                ";  y=" + str(self.pose.y) + ";  theta=" + str(yaw))

def main(args=None):
    turtlebot = Turtlebot3()

if __name__ == '__main__':
    main()
```

This implementation made use of the `quaternion_from_euler` method, which can be approximated with the code below. The idea is it turns the orientation from the pose into angles of roll, pitch and yaw, which are more helpful the error correction we are doing. 
```python
def euler_from_quaternion(quaternion):
    """
    Converts quaternion (w in last place) to euler roll, pitch, yaw
    quaternion = [x, y, z, w]
    """
    x = quaternion.x
    y = quaternion.y
    z = quaternion.z
    w = quaternion.w

    sinr_cosp = 2 * (w * x + y * z)
    cosr_cosp = 1 - 2 * (x * x + y * y)
    roll = np.arctan2(sinr_cosp, cosr_cosp)

    sinp = 2 * (w * y - z * x)
    pitch = np.arcsin(sinp)

    siny_cosp = 2 * (w * z + x * y)
    cosy_cosp = 1 - 2 * (y * y + z * z)
    yaw = np.arctan2(siny_cosp, cosy_cosp)

    return roll, pitch, yaw
```

We then had to perform, the same mind-numbing experiments with our new controller.
| Experiment 1 ($x$) | Experiment 1 ($y$) | Experiment 2 ($x$) | Experiment 2 ($y$) | Experiment 3 ($x$) | Experiment 3 ($y$) |
| --- | --- | --- | --- | --- | --- |
| -0.004501 | -0.000886 | 0.002945 | 0.000593 | 0.03445 | 0.021152 |
| -0.004361 | -0.00086 | 0.002781 | 0.001219 | 0.07094 | 0.035074 |
| -0.003318 | -0.001435 | 0.00525 | 0.001408 | 0.043388 | 0.014404 |
| -0.004816 | -0.001344 | 0.004502 | 0.000805 | 0.013611 | 0.000945 |
| 0.006804 | -0.002168 | 0.006219 | -0.000725 | 0.039821 | 0.001534 |
| -0.003316 | -0.001158 | 0.002494 | -0.000789 | 0.034444 | 0.041124 |
| -0.005515 | -0.000822 | -0.003222 | 0.001415 | 0.036526 | 0.019377 |
| -0.003885 | -0.000846 | 0.002978 | 0.000111 | 0.010358 | 0.001728 |
| -0.006976 | -0.001976 | -0.001769 | 0.000872 | 0.024386 | -0.00478 |
| 0.013538 | -0.001094 | -0.003788 | -0.000206 | 0.081652 | -0.002986 |

Experiment 1:
$$
\Sigma = \frac{1}{N}\begin{bmatrix}
0.0000382 & -0.0000007 \\\\
-0.0000007 & 0.0000002
\end{bmatrix}, \text{ scatter range } = (0.0195, 0.0004)
$$

Experiment 2:
$$
\Sigma = \frac{1}{N}\begin{bmatrix}
0.0000112 & -0.0000004 \\\\
-0.0000004 & 0.0000006
\end{bmatrix}, \text{ scatter range } = (0.0033, 0.0008)
$$

Experiment 3:
$$
\Sigma = \frac{1}{N}\begin{bmatrix}
0.0004585 & 0.0000728 \\\\
0.0000728 & 0.0002362
\end{bmatrix}, \text{ scatter range } = (0.0214, 0.0153)
$$

![Scatter diagram of results comparing open-loop to closed-loop](./md/images/Figure_1.png)
*Scatter diagram of results comparing open-loop to closed-loop.*

As you will quickly be able to tell, PD closed-loop is A LOT better than regular open-loop in terms of accuracy, with several scales of magnitude smaller error. We see that angular speed (rotation angle) is far more significant in affecting my robot, compared to linear speed (uncertainty in drive distance). This is demonstrated by how we use the angle for PD as opposed to linear speed, and it is because one step at an incorrect angle can move the robot away from the target significantly more than if it is approaching the target too fast or slow. Furthermore, error induced by angular speed is exemplified by its much smaller and precise domain of $[-\pi, \pi]$, compared to the real $x,y$ plane affected by linear speed, so it is easier to have more error from a wrong angle than a wrong speed. 

Under different levels of noise, we can see from the scatter graphs that closed loop control is exceptionally better at shrugging off the noise and getting closer to the target. This is orders of magnitude better as indicated by the scales between noise affecting open loop and closed loop. It is trivial to understand why, as using PD we more regularly update and ensure that our robot is making positive movements toward the target. Therefore open loop control is subjected to the disruption of noise far more. There are the trivial ways that a closed loop control robot may not work, such as the sensors not properly working, therefore we have no access to odometry. Another more interesting way it may fail is if we are working with two closed loop control robots simultaneously, which their respective interactions with environment may cause a loop of how the robot tries to reach their target, constantly going back and forth. We could develop the PD robot design further to be more precise in several ways. Firstly we could use the original PID equation, using more terms to more accurately account for how the robot corrects itself. Next we could fine-tune through simulation, trial and error, or even machine learning the coefficients for PID, ensuring that we have the most optimal values for a given task. Additionally, we could add realignment algorithms for if the robot gets significantly off track, where we instead aim to return to a known or given path, rather than perhaps futilely trying to reach the next waypoint. Finally we would want to use more advanced sensors which better account for real world granularity, letting us work with greater precision. How we recover from motion drift is seen with PD, proportionally moving the robot back to the original path, but we can improve it with a method of calibration. Depending on our sensors, defining constants while the robot moves that can be used as references to what is correct and what motion should entail, could let us then choose better motion options. We may also use a Kalman filter to reduce uncertainties and move such that noise has a minimised impact on our robot.

# Task 5
This final lab was focused on sensors and object avoidance. We did not fully complete the lab, but managed to scramble to get the first two parts completed. Turtlebot3 uses a Laser Distance Sensor (LDS), which calculates the difference of the wavelength when the laser source is reflected by the object. It typically consists of a single laser source, a reflective mirror, and a motor. When you drive the LDS, you can hear the sound of the rotating motor, because it rotates the inner mirror and scans the laser in a horizontal plane. The motor rotates the mirror and sensor measures the return time of the laser (calculates the difference in wavelength). The accuracy is dropped as the distance becomes further.

There are some issues with LDS, such as potentially harming the human eye (Turtlebot3 is a class 1 which is safe); and requiring the reflection of the laser, so materials like glass which may warp the laser will not be ass effective. 

We can get the laser data by using the following commands:
```bash
ros2 launch turtlebot3_gazebo turtlebot3_world.launch.py
ros2 launch turtlebot3_bringup rviz2.launch.py
ros2 topic list
ros2 topic info scan
ros2 interface show sensor_msgs/msg/LaserScan
ros2 topic echo scan
```
This gives the data from the scanner, with a list of ranges and intensities, as well as many other pieces of information. Firstly we had to make some simple code to extract the laser data, where we get it in four directions:
- Front: ranges[0]
- Left: ranges[89]
- Back: ranges[179]
- Right: ranges[269]

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan

class Laser(Node):
    def __init__(self):
        super().__init__('laser')
        self.subscription_ = self.create_subscription(LaserScan, 'scan', self.scan_callback, 10)

        self.subscription_  # prevent unused variable warning
        self.get_logger().info('Laser has been initialized.')

    def scan_callback(self, msg: LaserScan):
        string = str(msg.ranges[0]) + ", " + str(msg.ranges[89]) + ", " + str(msg.ranges[179]) + ", " + str(msg.ranges[269])
        self.get_logger().info(string)

def main(args=None):
    rclpy.init(args=args)
    laser = Laser()
    rclpy.spin(laser)
    laser.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

We now want to use this for simple obstacle avoidance. So we move our robot forward, and stop once there is an obstacle according to sensor observations. 

Firstly is the open-loop object avoidance. This code takes a very naive approach to getting the robot to stop, where it constantly takes in the laser's scan message, and if the distance from the front laser, indicated by `msg.ranges[0]`, is less than our threshold 0.3, then we immediately stop and kill all linear velocity. Otherwise, we move forward as intended, and move at 0.4 speed. 
```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Twist

class Avoid(Node):
    def __init__(self):
        super().__init__('laser')
        self.subscription_ = self.create_subscription(LaserScan, 'scan', self.scan_callback, 10)
        self.publisher_ = self.create_publisher(Twist, 'cmd_vel', 10)
        self.subscription_  # prevent unused variable warning
        self.get_logger().info('Avoid has been initialized.')

    def scan_callback(self, msg: LaserScan):
        new_msg = Twist()
        if msg.ranges[0] < 0.3:
            new_msg.linear.x = 0.0
            self.publisher_.publish(new_msg)
        else:
            new_msg.linear.x = 0.4
            self.publisher_.publish(new_msg)

def main(args=None):
    rclpy.init(args=args)
    avoid = Avoid()
    rclpy.spin(avoid)
    avoid.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

Next is closed-loop object avoidance. This code instead now will gradually reach the stopping threshold of 0.3 using the Controller class previously implemented, where we use PD to slow our approach toward a detected wall. We go either the slowing down speed, or the speed of 0.4. If we have stopped, and therefore our calculated PD is below 0, we simply kill linear velocity and set that to 0. Our approach to determine the coefficients was found through trial and error, finding the values that slowed the robot at an appropriate rate. We just tested in the standard range of 0.1 and 0.9 for both $k_d$ and $k_p$.  

If the objects that we are trying avoid colliding with are moving, as in they have non zero velocity, then our current methods will not be appropriate as we may slow down too fast or too slow to appropriately react to the object. We can have a variable threshold distance to account for this, where fast moving objects must result in a greater threshold distance, as then our PD will more rapidly slow us down. We would want to make threshold distance dependent on both the velocity of the robot and the object to the best of the sensing ability. If we were to just use lasers, we may be limited to use the ranges to approximate how fast an object may or may not be moving toward us. If we have more sensors, we may have a better idea or even a mapping of objects in the area, which subsequently would let us predict where they may be in x number of time steps, which could influence our stopping distance.
```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Twist

class Controller:
    def __init__(self, P=0.0, D=0.0, set_point=0):
        self.Kp = P
        self.Kd = D
        self.set_point = set_point # reference (desired value)
        self.previous_error = 0

    def update(self, current_value):
        # calculate P_term and D_term
        error = self.set_point - current_value
        P_term = self.Kp * error
        D_term = self.Kd * (error-self.previous_error)
        self.previous_error = error
        return P_term + D_term

    def setPoint(self, set_point):
        self.set_point = set_point
        self.previous_error = 0
    
    def setPD(self, P=0.0, D=0.0):
        self.Kp = P
        self.Kd = D

class Avoid(Node):
    def __init__(self):
        super().__init__('laser')
        self.subscription_ = self.create_subscription(LaserScan, 'scan', self.scan_callback, 10)
        self.publisher_ = self.create_publisher(Twist, 'cmd_vel', 10)
        self.subscription_  # prevent unused variable warning
        self.get_logger().info('Avoid has been initialized.')

        self.controller = Controller(0.8, 0.6, 0.3)

    def scan_callback(self, msg: LaserScan):
        
        new_msg = Twist()
        speed = min(controller.update(msg.ranges[0]),0.4)
        if speed > 0.0:
            new_msg.linear.x = speed
        else:
            new_msg.linear.x = 0.0
            
        self.publisher_.publish(new_msg)

def main(args=None):
    rclpy.init(args=args)
    avoid = Avoid()
    rclpy.spin(avoid)
    avoid.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

# Conclusion 
This coursework was all kinds of frustrating and disappointing. Barring the fact we weren't using any real robots, it was still mostly a very annoying affair with a virtual environment that loved to fail or run out of memory; experiments which took over an hour of monotonous grunt work of recording values; all with semi-poor explanations of the origins of some of the equations like PID. For a robotics coursework, it really did a good job of putting me off robotics for a long time to come. It was still helpful for learning the basics of ROS, how to navigate and utilise a closed-loop controller; but overall I do not miss it in the slightest.