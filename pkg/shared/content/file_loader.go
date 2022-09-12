package content

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

// FileLoader is a utility to load all files in a given directory filtered by extension
type FileLoader struct {
	contentDirectory    string
	fileExtensionFilter string
	fileData            map[string]string
}

// NewFileLoader creates and returns a new instance of a FileLoader
func NewFileLoader(directory string, extension string) *FileLoader {
	return &FileLoader{contentDirectory: directory, fileExtensionFilter: extension}
}

// Load searches for all files matching config specification and loads them into fileData
func (f *FileLoader) Load() error {
	files, err := f.findContentFilesMatchingExtensionFilter()
	if err != nil {
		return err
	}

	return f.loadContentFromFiles(files)
}

func (f *FileLoader) loadContentFromFiles(files []string) error {
	_ = f.Reset()
	for _, path := range files {
		err := f.loadContentFromFile(path)
		if err != nil {
			return err
		}
	}

	return nil
}

func (f *FileLoader) loadContentFromFile(path string) error {
	//nolint:gosec
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return err
	}

	fileName := strings.TrimSuffix(filepath.Base(path), filepath.Ext(path))
	f.fileData[fileName] = string(data)
	return nil
}

func (f *FileLoader) findContentFilesMatchingExtensionFilter() ([]string, error) {
	var files []string
	err := filepath.Walk(f.contentDirectory, func(path string, fileInfo os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if fileInfo.IsDir() {
			return nil
		}

		ext := filepath.Ext(path)
		if ext == f.fileExtensionFilter {
			files = append(files, path)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}
	return files, nil
}

// Reset releases all file data and sets it to an empty map
func (f *FileLoader) Reset() error {
	f.fileData = make(map[string]string)
	return nil
}

// Get searches for a loaded file by name and returns its content
func (f *FileLoader) Get(fileName string) (string, error) {
	data, keyFound := f.fileData[fileName]

	if !keyFound {
		return "", fmt.Errorf("file name [%s] not found", fileName)
	}

	return data, nil
}

// GetAll returns a collection of loaded file data
func (f *FileLoader) GetAll() map[string]string {
	return f.fileData
}
