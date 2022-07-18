package main

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

func TestMain(t *testing.T) {

	type testExpected struct {
		status int
		file   string
		size   int64
	}

	type testCase struct {
		filename string
		filepath string
		expect   testExpected
	}
	tests := map[string]testCase{
		"pngAvatar": {
			filename: "test.png",
			filepath: "./test.png",
			expect: testExpected{
				status: http.StatusAccepted,
				file:   "test.png",
				size:   int64(58502),
			},
		},
		"textFile": {
			filename: "test.txt",
			filepath: "./test.txt",
			expect: testExpected{
				status: http.StatusAccepted,
				file:   "test.txt",
				size:   int64(0),
			},
		},
		"bigJpeg": {
			filename: "3.jpg",
			filepath: "./3.jpg",
			expect: testExpected{
				status: http.StatusInternalServerError,
				file:   "",
				size:   int64(0),
			},
		},
	}

	for name, tc := range tests {

		body := new(bytes.Buffer)
		// This writer is going to transform
		// what we pass to it to multipart form data
		// and write it to our io.Pipe
		writer := multipart.NewWriter(body)

		// This is the file we are going to upload
		file, err := os.Open(tc.filepath)
		if err != nil {
			t.Error(err)
		}
		defer file.Close()

		// This is the file handler
		fileWriter, err := writer.CreateFormFile("uploadImg", tc.filepath)
		if err != nil {
			t.Error(err)
		}

		// Copy the file data to the file handler
		if _, err = io.Copy(fileWriter, file); err != nil {
			t.Error(err)
		}

		// Close the writer
		if err := writer.Close(); err != nil {
			t.Error(err)
		}


		router := setupRouter()

		// Create a new request
		req, err := http.NewRequest(http.MethodPost, "/upload", body)
		if err != nil {
			t.Error(err)
		}

		// Set the content type
		req.Header.Add("Content-Type", writer.FormDataContentType())

		// Create a new recorder
		res := httptest.NewRecorder()

		// Serve the request
		router.ServeHTTP(res, req)

		// Check the status code
		if status := res.Code; status != tc.expect.status {
			t.Errorf("test case: %v - handler returned wrong status code: got %v want %v",
				name, status, tc.expect.status)
		}

		// Check the response body
		expected := fmt.Sprintf("filename: %s, filesize: %d", tc.expect.file, tc.expect.size)
		if res.Body.String() != expected {
			t.Errorf("test case: %v FAILED; got %v want %v",
				name, res.Body.String(), expected)
		}
	}

}
