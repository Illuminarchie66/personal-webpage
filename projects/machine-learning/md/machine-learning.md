# Introduction
Our machine learning coursework was focused upon Latent Factor Models with Kernels. This module was highly maths focused, with less emphasis on the implementation and more the mathematical rigour that justified statistical techniques. It broke down into two primary tasks, a proof involving latent factor models, and then taking a set of data and classifying it using a kernel. 

# Task 1
We want to perform Principal Component Analysis (PCA) on a dataset which has had a change of basis, without explicitly knowing or calculating the mapping. We know that:
$$
\begin{equation}
    \mathbf{Z} = \phi(\mathbf{X}) \mid \mathbf{X} \in \mathbb{R}^{n\times d} \:, \mathbf{Z} \in \mathbb{R}^{n\times m} 
\end{equation}
$$
Normally to perform PCA on $\mathbf{Z}$, we would need to use Singular Value Decomposition to find its top PCs: 
$$
\begin{equation}
    \mathbf{Z} = \mathbf{U}\mathbf{\Sigma} \mathbf{V}^\top \mid \mathbf{U} \in \mathbb{R}^{n\times n}, \mathbf{\Sigma} \in \mathbb{R}^{n\times m}, \mathbf{V} \in \mathbb{R}^{n\times m}
\end{equation}
$$
We want to isolate $\mathbf{Z}$'s top $k$ components, found with $\mathbf{V}^\top = \mathbf{W}$, and then project our dataset using $\mathbf{Z}' = \mathbf{ZW}$, where $\mathbf{Z}'$ is our projected data. We can do this using our kernel. We know that: 
$$
\begin{equation}
    \mathbf{K} = \phi(\mathbf{X})\phi(\mathbf{X})^\top = \mathbf{ZZ}^\top \mid \mathbf{K} \in \mathbb{R}^{n\times n}
\end{equation}
$$
where $\mathbf{K}$ is our Gram matrix such that $\textbf{K}_{ij} = \mathbf{\kappa}(\mathbf{x\_i}, \mathbf{x\_j}) \: \forall \: i,j \in [1,n]$ We are going to assume that we can center both $\mathbf{Z}$ and $\mathbf{K}$.

Now with this set up we can find the relation between $\mathbf{Z}$ and $\mathbf{K}$.
$$
\begin{align*}
      \mathbf{K} &= \phi(\mathbf{X})\phi(\mathbf{X})^\top \\\\
             &= \mathbf{ZZ}^\top\\\\
             &= (\mathbf{U\Sigma} \mathbf{V}^\top)( \mathbf{U\Sigma} \mathbf{V}^\top)^\top \quad \text{ by } (2) \\\\
             &= (\mathbf{U\Sigma} \mathbf{V}^\top) \mathbf{V}^{T^\top}(\mathbf{U\Sigma})^\top \\\\
             &= \mathbf{U\Sigma} \mathbf{V}^\top \mathbf{V} \mathbf{\Sigma}^\top \mathbf{U}^\top \\
\end{align*}
$$
We know that $\mathbf{V}$ is orthonormal, hence $\mathbf{V}^\top = \mathbf{V}^{-1}$ 
$$
\begin{align*}
    &= \mathbf{U\Sigma} \mathbf{V}^{-1} \mathbf{V} \mathbf{\Sigma}^\top \mathbf{U}^\top \\\\
    &= \mathbf{U\Sigma} \mathbf{I} \mathbf{\Sigma}^\top \mathbf{U}^\top \\\\
    &= \mathbf{U\Sigma}\mathbf{\Sigma}^\top \mathbf{U}^\top \\\\
\end{align*}
$$
We know that $\mathbf{\Sigma} \in \mathbb{R}^{n\times m}$ and is diagonal matrix with padding. 
$$
\begin{aligned}
    \mathbf{\Sigma} &= 
        \underbrace{
            \begin{bmatrix}
                \sigma\_1  & 0 & ... & 0 \\\\
                0 & \sigma\_2 & ... & 0 \\\\
                \vdots & \vdots & \ddots & \vdots \\\\
                0 & 0 & ... & \sigma\_m \\\\
                \vdots & \vdots & \ddots & \vdots \\\\
                0 & 0 & ... & 0 
            \end{bmatrix}
        }\_{\displaystyle m}
        \left.\vphantom{
            \begin{bmatrix}
                \sigma_1 & 0 & ... & 0 \\\\
                0 & \sigma_2 & ... & 0 \\\\
                \vdots & \vdots & \ddots & \vdots \\\\ 
                0 & 0 & ... & \sigma\_m \\\\ 
                \vdots & \vdots & \ddots & \vdots \\\\
                0 & 0 & ... & 0
            \end{bmatrix}
        }\right\\}n \\\\
\end{aligned}
$$

$$
\begin{aligned}
    \mathbf{\Sigma} \mathbf{\Sigma}^\top &= \mathbf{\Sigma} &= 
        \underbrace{
            \begin{bmatrix}
                \sigma\_{1}^2 & & & & &\\\\
                & \sigma\_{2}^2 & & & &\\\\
                & & \ddots & & &\\\\
                & & & \sigma\_{m}^2 & &\\\\
                & & & & \ddots & \\\\
                & & & & & 0
            \end{bmatrix}
        }\_{\displaystyle n}
        \left.\vphantom{
            \begin{bmatrix}
                \sigma\_{1}^2 & & & & &\\\\
                & \sigma\_{2}^2 & & & &\\\\
                & & \ddots & & &\\\\
                & & & \sigma\_{m}^2 & &\\\\
                & & & & \ddots & \\\\
                & & & & & 0
            \end{bmatrix}
         }\right\\}n 
\end{aligned}
$$
This assumes $n > m$, however if this is not the case, it just means we have $n$ values and padding in the columns instead of the rows, with negligible impact. 
We also know that $\mathbf{U}$ is orthnormal, hence $\mathbf{U}^\top = \mathbf{U}^{-1}$ 
This gives us that:
$$
\begin{equation}
      \mathbf{K} = \mathbf{U}\mathbf{\Sigma}^2 \mathbf{U}^{-1}
\end{equation}
$$
If we now look at $\mathbf{K}$ separately, we can choose to diagonalise it, which gives: \\ 
$$
\begin{equation}
    \mathbf{K} = \mathbf{D}\mathbf{\Lambda}\mathbf{D}^{-1}
\end{equation}
$$
Such that $\mathbf{D}$ are the eigenvectors of $\mathbf{K}$ and $\mathbf{\Lambda}$ is a diagonal matrix containing the eigenvalues $\lambda\_1, \lambda\_2, ..., \lambda\_n$ of $\mathbf{K}$    
$$
\begin{align}
      &\mathbf{U}\mathbf{\Sigma}^2 \mathbf{U}^{-1} = \mathbf{D}\mathbf{\Lambda}\mathbf{D}^{-1} \nonumber \\\\
      \implies & \mathbf{U} = \mathbf{D}\\\\
               & \mathbf{\Sigma}^2 = \mathbf{\Lambda} \nonumber \\\\
      \implies & \sigma\_i = \sqrt{\lambda\_i} \: \: \forall \: i=1...m
\end{align}
$$
We can conclude this since the dimensions of $\mathbf{D}$ and $\mathbf{U}$ are equal, and the dimensions of $\mathbf{\Lambda}$ and $\mathbf{\Sigma}^2$ are equal. This means we can piecewise associate the values, and conclude $(7)$ and $(8)$. 

By the lectures we know that our projection $\mathbf{Z}' = \mathbf{ZW} = \mathbf{U\Sigma}$. We have found that $\mathbf{U} = \mathbf{D}$ and that $\mathbf{\Sigma} = \sqrt{\mathbf{\Lambda}}$ such that $\sqrt{\mathbf{\Lambda}}$ is an $n\times m$ diagonal matrix with values $\sqrt{\lambda\_1}, \sqrt{\lambda\_2},..,\sqrt{\lambda\_m}$. Both $\mathbf{D}$ and $\sqrt{\lambda\_1}, \sqrt{\lambda\_2},..,\sqrt{\lambda\_m}$ are calculated from $\mathbf{K}$, thus we have performed PCA on $\mathbf{Z} = \phi(\mathbf{X})$ without calculating $\mathbf{Z}$.

Next we need to project the top $k$ PCs without explicitly calculating them; as in without calculating $\mathbf{V}^\top = \mathbf{W}$. From the lectures, we know we can find the top $k$ PCs using only $\mathbf{U}$ and $\mathbf{\Sigma}$. We order the pairs of columns of $\mathbf{U}$ and the values of $\mathbf{\Sigma}$ in descending order: $\sigma\_1 > \sigma\_2 > ... > \sigma\_m$. We then take the top $k$ and calculate columns of $\mathbf{W}$ (our PCs) using: 
$$
\begin{equation}
    \mathbf{w}\_c = \frac{1}{\sigma\_c}\mathbf{Z}^\top\mathbf{u}\_c
\end{equation}
$$
We want to calculate the projection $\mathbf{Z}' = \mathbf{Z}\mathbf{W}$, so we will premultiply $(9)$ with $\mathbf{Z}$. 
$$
\begin{align}
    \mathbf{Zw}\_c &= \vert \frac{1}{\sigma\_c}\mathbf{ZZ}^\top\mathbf{u}\_c \nonumber \\\\
                  &= \frac{1}{\sigma\_c}\mathbf{K}\mathbf{u}\_c \quad \text{ by } (3)
\end{align}
$$
This gives a $n\times 1$ projection of the $c$th component, which if we combine with the top $k$ components we get: 
$$
\begin{equation}
    \mathbf{Z}' = 
        \underbrace{
            \begin{bmatrix}
                \vert & \vert & & \vert \\\\
                \mathbf{Z}\mathbf{w}\_1 & \mathbf{Z}\mathbf{w}\_2 & ... & \mathbf{Z}\mathbf{w}\_k \\\\ 
                \vert & \vert & & \vert
            \end{bmatrix}
        }\_{\displaystyle k}
        \left.\vphantom{
            \begin{bmatrix}
                \vert & \vert & & \vert \\\\
                \mathbf{Z}\mathbf{w}\_1 & \mathbf{Z}\mathbf{w}\_2 & ... & \mathbf{Z}\mathbf{w}\_k \\\\ 
                \vert & \vert & & \vert
            \end{bmatrix}
         }\right\\}n 
\end{equation}
$$

Since we have $\mathbf{U}$ and $\mathbf{\Sigma}$ calculated through $\mathbf{K}$, and we calculate the projection without ever having to calculate $\mathbf{W}$ (the PCs), using $(10)$ we have proven we can project the data points in $\mathbf{Z} = \phi(\mathbf{X})$ without explicitly using the PCs.

# Task 2
The goal for this task is to classify a series of data points into binary classes. The data takes the form of a circle, with class 0 (red) in the middle, and class 1 (blue) circling it.

![Original datapoints plotted](./md/images/1.png)
*Original datapoints plotted with classification shown by colours.*

The homogeneous polynomial kernel is used to project data to a higher dimensionality, which introduces non-linearity into the feature space. If our data is linearly inseparable, we may be able to separate it using a non linear separator, such as a quadratic function. By projecting our data to a higher dimensionality, we work with the data fit to a new feature space; meaning that non linear functions can be represented linearly in this dimension. Applying this to our task, we would try to use the homogeneous polynomial kernel to wrap a circular separator around our data.

As we are working with only a homogeneous kernel, we are limited to how successful working in higher dimensions will be, as the new dimensions added will only be able to work within a certain shape. We would be altering the hyper parameter of $d$ which refers to the new dimension we are raising the data to. Additionally, it is important to note that as there is no assertion that $\mathbf{K}$ is positive, we can only use integer values for the hyper parameter, otherwise complex values are given which are not useful for classification. We experiment with the hyper parameter $d$ of the homogenous polynomial using our PCA implementation, and look at the top 3 principal components (as they can be visualised easily) to see the potential of any linearly separable data projections. Given the figure below we can see that $d=1$ does nothing to meaningfully change the data, as it projecting the data into the same number of dimensions, so the circular shape is maintained. We can see that odd valued $d$ gives us bundles of class 1 surrounded by class 2, acting similarly to the original dataset with greater variation in the datapoints surrounding the center - which follows from $d=1$ also being odd. Furthermore for odd $d$, $\text{sgn}(x) = \text{sgn}(x^d)$ meaning the projection stretches and shrinks distances between points, but never causes them to wrap around to a new direction.

![3D plots of homogeneous polynomial kernels](./md/images/2.png)
*3D plots of homogeneous polynomial kernels of different hyper parameters from multiple angles.*

When looking at even $d$, the results look far more promising as we see classes grouping together to spread out as a cone, which follows from the approximate shape of even degree polynomials. As this is homogeneous, we form the cone at the center of the original data, grouping much of the central class together. When we increase our $d$ to larger values, we see that more and more data points collapse in on themselves; which is a result of $|\langle \mathbf{x_i}, \mathbf{x_j} \rangle| < 1$ so large $d$ makes them increasingly smaller, thus increasingly similar. This shows that if we were to use homogeneous that we would want to use a small even value. At first $d=2$ looks promising from the plots, however we see when looking at the 2D planes of each axis, that the plot has no clear separation. This is from a result of our `cone` that we are forming is limited without the constant present in nonhomogeneous polynomials, and so we are forced to capture points which are close to the border. This makes homogeneous polynomial kernel not very suitable for this task.

![2D plots of homogeneous polynomial kernel where d = 2](./md/images/3.png)
*2D plots of homogeneous polynomial kernel where d = 2.*

The Gaussian radial basis function kernel is used to project data to into vector space of infinite dimension. The function acts as a density function of Euclidean distance similarities (Gaussian function). This can be interpreted from the function:
$$
\begin{equation}
    \mathbf{\kappa}(\mathbf{x\_i}, \mathbf{x\_j}) = \exp({-\frac{1}{2\sigma^{2}}||\mathbf{x\_i}-\mathbf{x\_j}||^2})
\end{equation}
$$
This function uses the Gaussian function using the Euclidean distance to weigh how close each point is. Closer vectors are rewarded higher values as their Euclidean distance will be closer to 0. The influence of each datapoint is determined by the hyper parameter $\sigma$, which influences the range of what is deemed *close* by the kernel. With larger values of $\sigma$, the conceptual Gaussian bell curve gets wider, which extends the impact of a single datapoint, effectively extending the reach of what vectors are considered close, and which aren't. 

Studying how the plot of top 3 PCs changes with this hyper parameter showcases this shift in the figure below (More values between these hyper parameter values were used, but this selection best shows how the plot changes with $\sigma$). For small values of $\sigma$, class 2 data has collapsed in on itself. This is because there exist large distances between datapoints in class 2\hyperref[fig:originaldata]{(Fig:1)}. Then when looking at the radial basis function, if distance $\delta$ is large and $\sigma$ is small, $\exp{-\frac{\delta}{2\sigma^2}}$ will be very small, as $\sigma$ is too small to stop $delta$ from dominating. This remains between $\sigma = 0.01$ and $\sigma=1$. When we reach $\sigma=2$ we find that $\sigma$ is large enough that class 2 does not collapse in on itself, and instead a dome is forming between class 1 and class 2 datapoints. This continues as $\sigma$ increases, as class 2 expands, and class 1 closes in on itself. Now $\sigma$ is large, points with large Euclidean distances between them are properly represented, whereas close points are grouped together like a bell curve due to their similarity. This behavior is crucial for our classification as we want to be able to group together the data that is close together in the circle. 

![3D plots of radial basis function kernels](./md/images/4.png)
*3D plots of radial basis function kernels of different hyper parameters from multiple angles.*

As we approach $\sigma = 10$, we see a bell curve that has grouped together class 1 to the end; which implies we can linearly separate the data, which we can see by the straight line we can draw when looking at the 2D plots of the planes. If we keep increasing $\sigma$ to larger numbers past 20, we see that class 1 data continues to bunch up closer and closer together, however remains to be linearly separable, showing that past a certain threshold, the data is effectively linearly separated.

![2D plots of radial basis function kernel where σ = 10](./md/images/5.png)
*2D plots of radial basis function kernel where σ = 10.*

We can actually derive approximately what this threshold is by looking at our original data. Since $\sigma$ reflects the kernel's 'width', this means that it is likely closely tied to the width of the original data we are trying to classify. Looking at class 1, and finding the average of the largest 10 Euclidean distances between points, we find that the approximate diameter (or width) of the center of class 1 datapoints is $7.169$. When we look at how the plot changes between $6.8$ and $7.2$ in the plot below, we can see that not only does the data flip, but it also becomes much more clearly separable. The data seems to flip at approximately $7.05$. This tells us that the width $\sigma$ directly relates to the diameter of the cluster of data we want to classify. So long as our hyper parameter exceeds the threshold, we can linearly classify our data.

![2D plots of radial basis function kernels](./md/images/6.png)
*2D plots of radial basis function kernels of different hyper parameters around the linear
separation threshold.*

Hence to conclude, we will use Gaussian radial basis function kernel, with a provided $\sigma = 10$. We use the Gaussian kernel because of the shown inadequacy of the homogeneous polynomial, and because the Gaussian kernel implicitly projects groups of vectors which are similar, which suits this problem of classifying data that is in a cluster. We can choose $\sigma=10$ as so long as it is greater than the approximate threshold $7.05$, it will likely be viable. Specifically 10 is chosen as the experiments found this to be a successful hyper parameter to classify the data.

# Task 3, 4 and 5
The minimum number of top PCs of the new data that we need is 3. This can be seen with the 2D plots of radial basis function kernel where $\sigma=10$, where on the second and third plots, we can see that we can linearly separate the two classes with a horizontal line of $\text{PC3} = 0.286$. If we only had two principal components we would be limited to what is depicted in the first subplot, which does not help us. Since we can separate the two classes, this is our effective decision stump, as any piece of data with their 3rd PC $> 0.286$ is labelled class 1, and anything else is class 2. By implementing this code and running it in comparison with ground truth labels, we achieved 100% accuracy as seen in the code. We came to this separator by using our justifications of our kernel and hyper parameter choice, and then calculating the distance between the lowest of PC3 of class 1, and the highest of PC3 of class 2.
$$
\begin{align*}
    \text{midpoint} &= \frac{\max{(\text{class1})} + \max{(\text{class2})}}{2} \\\\
                    &= \frac{0.31037890 + 0.26152499}{2} \\\\
                    &\approx 0.286
\end{align*}
$$
With the decision stump described, and its success of classification being 100\%, we can now look into plotting the data. With our decision stump we identified that not only is the data linearly separable, but it is separable in just one dimension, with respect to $\mathbf{Z}$'s third PC. Because of this, we can plot the data in 1D, 2D, and 3D.

![1D plot of radial basis function kernel where σ = 10](./md/images/7.png)
*1D plot of radial basis function kernel where σ = 10.*

![3D plot of radial basis function kernel where σ = 10](./md/images/8.png)
*3D plot of radial basis function kernel where σ = 10.*

# Evaluation
Overall this coursework was a wonderful experience as it was a great balance of complex mathematics and actually applying it to our data. While the actual data processing wasn't difficult, with the transformation resulting in a very simple linear division, it was very effective in that it taught the power of kernel. It demonstrated both the radial basis function and the homogenous polynomial kernels wonderfully. 