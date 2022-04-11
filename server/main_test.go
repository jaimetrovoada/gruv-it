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

	tests := map[string]struct {
		fileName,
		fileSize,
		filePath,
		expect string
	}{
		"pngAvatar": {
			fileName: "test.png",
			fileSize: "58502",
			filePath: "./test.png",
			expect:   "status: 200, filename: test.png, filesize: 58502",
		},
		"textFile": {
			fileName: "test.txt",
			fileSize: "0",
			filePath: "./test.txt",
			expect:   "status: 200, filename: test.txt, filesize: 58502",
		},
	}

	for name, tc := range tests {

		body := new(bytes.Buffer)
		// This writer is going to transform
		// what we pass to it to multipart form data
		// and write it to our io.Pipe
		writer := multipart.NewWriter(body)

		// This is the file we are going to upload
		file, err := os.Open(tc.filePath)
		if err != nil {
			t.Error(err)
		}
		defer file.Close()

		// This is the file handler
		fileWriter, err := writer.CreateFormFile("uploadImg", tc.filePath)
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

		// Close the pipe
		// if err := pw.Close(); err != nil {
		// 	t.Error(err)
		// }

		// Create a new request
		req, err := http.NewRequest(http.MethodPost, "/upload", body)
		if err != nil {
			t.Error(err)
		}

		// Set the content type
		req.Header.Add("Content-Type", writer.FormDataContentType())

		// Create a new recorder
		res := httptest.NewRecorder()

		// Create a new server
		handler := http.HandlerFunc(HandleUpload)

		// Serve the request
		handler.ServeHTTP(res, req)

		// Check the status code
		// if status := res.Code; status != http.StatusAccepted {
		// 	t.Errorf("test case: %v - handler returned wrong status code: got %v want %v",
		// 		name, status, http.StatusAccepted)
		// }

		// Check the response body
		expected := fmt.Sprintf("status: %d, filename: %s, filesize: %s", http.StatusAccepted, tc.fileName, tc.fileSize)
		if res.Body.String() != expected {
			t.Errorf("test case: %v - handler returned unexpected body: got %v want %v",
				name, res.Body.String(), expected)
		}
	}

}
