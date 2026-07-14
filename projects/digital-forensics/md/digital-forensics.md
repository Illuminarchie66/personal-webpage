# Introduction
- What is digital forensics
- Coursework was completing specific labs
- Matlab

Digital forensics is the identification, analysis and extraction of electronic evidence found on digital devices and networks. This takes advanatge of technology and the algorithms underlying them to reconstruct data and identify tampering. It takes many different forms, but the area that we focused on in our module was on image-based forensics. Our coursework was focused upon compelting various tasks in Matlab, typically taking an image and performing some kind of transformation to produce something meaningful. Working in Matlab was a great opportunity to experiment with another language, being very similar to numpy and Python in operation and syntax. 

# Tasks
## Lab 2: Colour space transformation and visualisation
### Exercise 1
Our first lab worked with colour spaces. This addresses how images are stored within computers, where colour images typically are in RGB format, using red - green - blue, similar to the cones of our eyes. The combination of the colours in the pixels produce different colours; however we can isolate each channel and view what they have to offer. 

![Pepper Image broken down by RGB](./md/images/1.png)
*Pepper Image broken down by RGB.*

Now there are many other colour spaces, such as Y'CbCr, which was used for like old TVs. Our first exercise was to take an RGB image and convert t to the Y'CbCr colour space with a matrix transformation. This makes use of a known transformation between the two colorspaces, which is matrix multiplication over each color vector. 

```matlab
I = read(Tiff('peppers_RGB_tiled.tif', 'r'));

T = [0.2990 0.5870 0.1140; 
    -0.1687 -0.3313 0.5000;
     0.5000 -0.4187 -0.0813];
O = [0 128 128];
row = size(I, 1);
col = size(I, 2);

r = reshape(I, row*col, 3)';
transform = (T*double(r))+O';
ycbcr = reshape(transform', row, col, 3);
Y = ycbcr(:, :, 1);
Cb = ycbcr(:, :, 2);
Cr = ycbcr(:, :, 3);
```

Here we take an image of peppers, extracting the RGB channel, and then convert them to this other colorspace, where we can clearly see that it holds different information compared to RGB. Y (Luma) represents brightness/light intensity. Cb represents the color blue relative to the overall brightness. Cr represents color red to overall brightness. This is helpful for effecient storage, as the eye is highly sensitive to changes in brightness but poor at seeing fine details in color. This means we can compress the color data with chroma subsampling, with minimal loss in picture quality. 

![Pepper Image broken down by Y'CbCr](./md/images/2.png)
*Pepper Image broken down by Y'CbCr.*

### Excercise 2
We take advantage of the chroma subsampling in this exercise, by taking the image of a house, and converting it to Y'CbCr, then compressing the color channels (with basic sampling), and getting their dimensions. We find that Y' is $1080 \times 1920$, and Cb and Cr are $540 \times 960$. If we upscale the compressed color channels, while there is some loss, the display image quality is near identical as we lose little visual data from the light intensity.

![House Image broken down by Y'CbCr](./md/images/3.png)
*House image broken down by Y'CbCr with chroma subsampled color channels.*

Next we had to identify which suspect created a video. We are told that each suspect used a different subsampling technique: 
- Suspect A: $2 \times 2$ average
- Suspect B: left column average
- Suspect C: right column average 
- Suspect D: top-left sample
What we did was take the video frame, and looked at the Y and Cb channel. The Cb channel was compressed down with one of those subsampling methods, so we took the video frame Y channel and compressed it into YA, YB, YC, YD using each of the above methods. We then found the correlation between Yi and Cb and whichever was most correlated had their score incremented. We did this for all blocks across the image, until we had a distribution of the most correlated method. We found that D was most correlated with Cb, with 1578 blocks.

```matlab
function [suspectID,nblocks] = yCbForensics(videoframe)
    file = videoframe;
    fid = fopen(file, 'r');
    dataY = fread(fid, 1080*1920, 'uint16');
    dataY = reshape(dataY, 1080, 1920);
    dataCb = fread(fid, 1080*1920/4, 'uint16');
    dataCb = reshape(dataCb, 1080/2, 1920/2);
    dataCr = fread(fid, 1080*1920/4, 'uint16');
    dataCr = reshape(dataCr, 1080/2, 1920/2);

    YA = zeros(540, 960);
    YB = zeros(540, 960);
    YC = zeros(540, 960);
    YD = zeros(540, 960);
    for i=1:2:1080
        for j=1:2:1920
            avg = (dataY(i,j) + dataY(i+1,j) + dataY(i,j+1) + dataY(i+1,j+1))/4;
            avgLeft = (dataY(i,j) + dataY(i+1,j))/2;
            avgRight = (dataY(i,j+1) + dataY(i+1, j+1))/2;
            YA(ceil(i/2),ceil(j/2)) = floor(avg);
            YB(ceil(i/2),ceil(j/2)) = floor(avgLeft);
            YC(ceil(i/2),ceil(j/2)) = floor(avgRight);
            YD(ceil(i/2),ceil(j/2)) = dataY(i,j);
        end
    end
    
    vals = [0 0 0 0];
    suspects = ['A' 'B' 'C' 'D'];
    for i=1:12:540
        for j=1:12:960
            coeffecients = [(corr2(dataCb(i:i+11, j:j+11), YA(i:i+11, j:j+11))^2)...
                            (corr2(dataCb(i:i+11, j:j+11), YB(i:i+11, j:j+11))^2)...
                            (corr2(dataCb(i:i+11, j:j+11), YC(i:i+11, j:j+11))^2)...
                            (corr2(dataCb(i:i+11, j:j+11), YD(i:i+11, j:j+11))^2)];
            [~, maxIndex] = max(coeffecients);
            vals(maxIndex) = vals(maxIndex)+1;  
        end
    end
    [m, sus] = max(vals);
    suspectID = suspects(sus);
    nblocks = m;
end
```

## Lab 3: Discrete Fourier Transform
This lab was focused upon frequency spaces, with the Discrete Fourier Transform (DFT). This converts an image from a series of pixels into a series of frequencies, which can let us identify patterns latent to the image. One thing you can do in the frequence space is clean an image by removing specific frequencies utilising filters. We were tasked with taking an unclear fuzzy image of a car, and then cleaning it to make the license plate visible and readable. In particular it was covered with periodic noise, otherwise known as notch noise.

The method used to remove notch noise was to first visualise a shifted centred frequency image, which let me see the points of greatest frequency. Since noise is mostly centred around points of high frequency, and our noise was periodic, I identified the points of repeating high frequency, to which multiple filters would be applied together in that area to work in tandem to reduce noise while not greatly reducing image quality. Working in increments of 256 (going from [-512, -512] up to [512, 512]), I applied a lowpass ideal, Gaussian and Butterworth filter of each the same parameters. The point 0,0 was excluded as that high frequency represented key information from the image.

The parameters tuned were D0 in all three filters, and n in the Butterworth filter. So technically we tuned 4 different parameters, but you could argue its 2? Point is, these are the parameters that were changed around. The final values decided upon was for ideal: D0 = 30, Gaussian: D0 = 60 and Butterworth D0 = 220, n = 0.9. For ideal and Gaussian filters, D0 acted as the effective radius that the filter would affect in the frequency visual. Ideal would completely get rid of whatever it was at, while Gaussian would gently remove the rest. By removing the periodic high frequency points, the ideal filter radius was tuned to get entirely rid of the strongest part; while then the Gaussian filter would then gently remove other high frequencies around the high points, but not too much as to remove the frequencies of the undistorted image. Hence the ideal filter is about half the radius(D0) of the Gaussian filter. The Butterworth filter is slightly different, in which D0 does act like a radius, but its effects are far weaker and more sparse, hence the much larger radius. This makes the image far less grainy and a bit clearer. We can also change n, however increasing or decreasing it significantly past the default of 1.0 did not improve image quality.

The final image quality is fairly strong, and we can make out the driving licence to be 4DSU496. We could make the image more clear if we added a few more smaller filters around the higher frequency lines between the high frequency points.

![Cleaned image of the car](./md/images/4.png)
*Cleaned image of the car.*

```matlab
I = imread('halftone_evidence.pgm');
PQ = paddedsize(size(I));
F = fft2(I, PQ(1), PQ(2));

F2=fftshift(F); 
F3=abs(F2); 
F3=log(1+F3);

G = F;
pos = [-256, 256; 0, 256; 256, 256; -256, 0; 256, 0; -256, -256; 0, -256; 256, -256; 0 512; -256 512; 256 512; 512 -256; 512 0; 512 256; 512 512];
pos = pos+1;
for i=1:size(pos,1)
    H = notch('ideal', PQ(1), PQ(2), 30, pos(i,1), pos(i,2));
    G = G.*H;
end

for i=1:size(pos,1)
    H = notch('gaussian', PQ(1), PQ(2), 60, pos(i,1), pos(i,2));
    G = G.*H;
end

for i=1:size(pos,1)
    H = notch('btw', PQ(1), PQ(2), 250, pos(i,1), pos(i,2), 0.9);
    G = G.*H;
end

G2=fftshift(G); 
G3=abs(G2); 
G3=log(1+G3);

g = real(ifft2(G));
g = g(1:size(I,1), 1:size(I,2));
figure(); 
subplot(2,2,1); imshow(F3, []); axis image;
subplot(2,2,2); imshow(G3, []); axis image;
subplot(2,2,3); imshow(g, []); axis image;
```

## Lab 4: Digital watermarking
### Exercise 1
The act of digital watermarking is a unique identifier embedded directly into digital content such as images or videos, to prove ownership, verify authenticity, or trace copyright infringement. Here we looked at this with the Warwick Logo and Baboon as the host image. First we simply display the binarised version of the Warwick logo via thresholding.

![Original and binarised Warwick logo.](./md/images/5.png)
*Original and binarised Warwick logo.*

Next we had to embed the binary Warwick logo into the Baboon image using Least Significant Bit (LSB) substitution, and Most Significant Bit (MSB) substitution, displaying both resulting images. This is based on how in a binary number the MSB carries the most information, the LSB carrying minute changes. Using LSB it is a near identical image, whereas MSB it is very clearly overlayed between the two.

![Baboon image embedded with Warwick Logo.](./md/images/6.png)
*Baboon image embedded with Warwick Logo.*

We finally compared them using the Structural Similarity Index Measure SSIM:
$$
\text{SSIM}(x,y) = \frac{(2\mu_x \mu_y + C_1)(2\sigma_{xy} + C_2)}{(\mu_x^2 + \mu_y^2 + C_1)(\sigma_x^2 + \sigma_y^2 + C_2)}
$$
which uses the mean, variance and covariance of the pixel intensities of images $x$ and $y$. The idea is that the more similar two images are, the closer SSIM is to 1. 

Between MSB and the original there was a SSIM of 0.1874 which is very low, showing how it disturbs the image. Meanwhile LSB and the original has an SSIM of 0.9994 showing how they are near identical. 

### Exercise 2
The final exercise for the watermark was looking at the robustness of a watermark under compression. We take a unique watermark (embedded to the Warwick logo), and we then compressed the image with different JPEG qualities, comparing no compression, quality=100, quality=98 and quality=95. Once compressed, we then needed to recover the original image by removing the watermark. We can see from the results below that even with 100 compression quality, it leaves a noticable trace and degredation in the image. Likewise 98 and 95 descend into pure noise. 

![Recovered images post compression.](./md/images/7.png)
*Recovered images post compression.*

## Lab 6: Compression based forensics
This lab was focused upon JPEG Ghost detection, which takes advantage of differing compression histories to identify tampering. Suppose someone has an original JPEG of quality 90, then it is edited in photoshop by adding something else, then it is saved again at a different JPEQ quality. As different parts of the image has undergone different JPEG histories, when we recompress, one quality tends to match the previous compression of the background. The spliced region meanwhile produces error, creating a visible ghost. We were tasked with making a function that identifies these ghosts on different images. 

```matlab
function diffImages = jpeg_ghosts(file, b, minQ, maxQ, stepQ)    
    imageL = imread(file);
    images = cell(ceil((maxQ-minQ)/stepQ)+1);
    [height, width, ~] = size(imageL);

    i=1;

    for q=minQ:stepQ:maxQ
        imwrite(imageL, 'compressed.jpg', 'Quality', q);
        image_compressed = imread('compressed.jpg');
        
        ghosts = zeros([height, width]);
        
        for x = 1:b:height
            for y = 1:b:width
                val = 0;
                for rgb=1:3 
                    for bx =1:b-1
                        for by = 1:b-1
                            if x+bx <= height && y+by <= width
                                val = val + (double(imageL(x+bx, y+by, rgb)) - double(image_compressed(x+bx, y+by, rgb)))^2;
                            end
                        end
                    end
                end
                if x+b-1 <= height && y+b-1 <= width
                    ghosts(x:x+b-1, y:y+b-1) = val / (3*b^2);
                end
            end
        end
        g = uint8(ghosts);
        images{i} = g;
        i = i + 1;
    end

    diffImages = images;
end
```

What this function does is take in the image file, the block size, and then a range of quality values to assess. What it does is recompress the image at quality q and compares it with the original, by computing the block-wise squared error. It saves each difference and returns the list of images, which we then manually looked over to identify which demonstrates the splicing the most. 

We had to complete this with three images. Firstly with the 'tiger.jpg' file, we can see from the image at quality compression 78, which shows the outline of the tiger from the original image. We can clearly see it outlined very obviously, and when comparing it to the original image, we can deduce the tiger was spliced in.

![tiger.jpg JPEG Ghosts at quality 78.](./md/images/8.png)
*tiger.jpg JPEG Ghosts at quality 78*

Next looking at 'soldier.jpg', we can identify that there are some spliced stripes present
on the soldier’s arm, by looking at the difference image using a quality of 93. We can then
compare to the original image to see the stripes are likely the flags and badges of the soldier
which has been spliced on.

![soldier.jpg JPEG Ghosts at quality 78.](./md/images/9.png)
*soldier.jpg JPEG Ghosts at quality 78*

Finally 'beach.jpg', we can identify that the girl has an outline of white spots around her,
which suggests they were edited and spliced in, mostly clearly seen at quality 65.

![beach.jpg JPEG Ghosts at quality 78.](./md/images/10.png)
*beach.jpg JPEG Ghosts at quality 78*

## Lab 7: Copy move forgery detection
For our final lab (that we completed), we tackled copy-move forgery detection via block matching. This is a type of digital image manipulation where a specific region from an image is copied and pasted into another part of the same image. This can be difficult to detect as since they stem from the same image they have the same lighting, same compression history, same textures etc. So our approach is block based, dividing the image into overlapping blocks, and we search for blocks with identical or highly similar pixel content, even if the cloned area was rotated or scaled.

```matlab
function A = blockMatch(I, t)
    I = im2double(I);
    [M, N] = size(I);

    options = struct;
    options.BlockSize = 16; % block-square window for comparison
    options.BlockStep = 1;
    options.visualize = true;
    options.threshold = t; %0.005; % measures how similar are two patches

    disp(options)
    if options.visualize
     subplot(3,1,1)
     imshow(I)
     title('Forged')
     pause(eps)
    end

    %%%%%%%%%%%%
    %%%    Your code here 

    SGrid = ScanningGrid(I, 16, 1, 1)';
    n = (N-16)*(M-16);
    data = zeros(n, 16*16);
    
    for k = 1:size(SGrid,1)
         data(k,:) = I(SGrid(k,:));
    end
    
    mask = zeros(1, M*N);
    
    [T, indexes] = sortrows(data);
    for i = 1:n-1
        diff = T(i, :) - T(i+1, :);
        ab = abs(diff);
        avg = mean(ab);
        if avg < t
             mask(SGrid(indexes(i), :)) = 1;
             mask(SGrid(indexes(i+1), :)) = 1;
        end
    end
    A = reshape(mask, M, N);

    if options.visualize
        subplot(3,1,2)
        imshow(A)
        title('Attention Mask')
    end

    %%%%%%%%%%%%%

    if options.visualize
     subplot(3,1,3)
     imshow(imfuse(A,I,'blend','Scaling','joint'))
     title('Detected Patches')
    end

end
```

We split the image into a series of 16 by 16 blocks using `ScanningGrid`, with a step size of 1 pixel, which produces many overlapping pixels. We flatten each patch into a vector, so each block becomes $1 \times 256$ feature vector. Instead of computing similarity between other blocks, we sort them lexicographically, so very similar blocks become neighbours in the sorted list. Then only adjacent rows are compared. If the mean difference is less than threshold `t` then oth patches are marked in the output mask. The threshold is improtant to manage, as if its too high then we risk many false positivies. Once implemented, we first had to run the algorithm on the image with `t=0.005` as the threshold, which gives:

![Copy-move detection with threshold 0.005.](./md/images/11.png)
*Copy-move detection with threshold 0.005.*

We had to determine the threshold that minimises false positives while still detecting the copied region. `t=0.013` was the decided threshhold; with the only false positives being three small spots in the trees above, and the plane empty ground below. Looking at the attention mask we can see that two share an identical shape, implying they are copies, while the three spots, and the larger spot are all unique. They are likely a result of similar blocks nearby due to the compression now being unable to distinguish them.

![Copy-move detection with threshold 0.013.](./md/images/12.png)
*Copy-move detection with threshold 0.013.*

# Evaluation
In conclusion, the Digital Forensics coursework was a great chance to learn image based techniques that have to contend with uncertainty and ineffeciency, but also worked with Matlab, giving me a further breadth of programming experience. While we were unable to finish the final lab, due to running out of time (third year was exhausting), the remaining labs were a good balance of guiding us through tasks and letting us develop algorithms on our own meaningfully. Each of my solutions are good enough, but there is definitely so much room to improve it further. This course work and module really set us up for image and video analysis in fourth year, which devled into these techniques and more. 