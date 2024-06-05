import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            alert('Please select an image');
            return;
        }

        setUploading(true);

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const formData = {
                    body: reader.result.split(',')[1],
                };
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                const fileName = image.name;
                const apiUrl = 'https://m10cwnd5ih.execute-api.us-east-1.amazonaws.com/dev/uploadFile';
                const queryParams = `?filename=${encodeURIComponent(fileName)}`;
                const url = apiUrl + queryParams;

                await axios.post(url, formData, config);

                const uploadedImageUrl = `https://priya-user-images.s3.amazonaws.com/${fileName}`;

                await saveImageUrlToDynamoDB(uploadedImageUrl);

                setImageUrl(uploadedImageUrl);
                setMessage('Image uploaded successfully.');
            };
            reader.readAsDataURL(image);
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage('Error uploading image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const saveImageUrlToDynamoDB = async (imageUrl) => {
        try {
            const savedUsername = localStorage.getItem('username');
            console.log(savedUsername);
            if (!savedUsername) {
                throw new Error('Username not found in local storage');
            }
            const requestBody = {
                username: savedUsername,
                profile_url: imageUrl
            };
            await axios.post('https://9pbt9ip0bl.execute-api.us-east-1.amazonaws.com/dev/saveURL', requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage('Image uploaded and URL saved to DynamoDB successfully.');
        } catch (error) {
            console.error('Error saving image URL to DynamoDB:', error);
            setMessage('Error saving image URL to DynamoDB. Please try again.');
        }
    };

    return (
        <div>
            {(
                <h1>{`${localStorage.getItem('username')}'s profile page`}</h1>
            )}
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="imageUpload">Upload Image:</label>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    <button type="submit" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
                <div>{message}</div>
                {imageUrl && (
                    <div style={{ marginTop: '20px' }}>
                        <h2>Uploaded Image:</h2>
                        <div style={{ 
                            width: '150px', 
                            height: '150px', 
                            borderRadius: '50%', 
                            overflow: 'hidden', 
                            border: '2px solid #ddd', 
                            display: 'inline-block' 
                        }}>
                            <img
                                src={imageUrl}
                                alt="Uploaded"
                                style={{ 
                                    width: '100%', 
                                    height: 'auto',
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                            />
                        </div>
                        <br />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
