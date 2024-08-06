package logutilities

import (
	"bytes"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// Custom WriteSyncer to capture logs
type testWriteSyncer struct {
	buffer bytes.Buffer
}

func (ws *testWriteSyncer) Write(p []byte) (n int, err error) {
	return ws.buffer.Write(p)
}

func (ws *testWriteSyncer) Sync() error {
	return nil
}

// GetBufferString returns the string output of the logger buffer
func (ws *testWriteSyncer) GetBufferString() string {
	return ws.buffer.String()
}

// createTestLogger returns a test write Syncer, and a logger to intercept and validate log messages
func createTestLogger() (*testWriteSyncer, *zap.Logger) {
	// Create a custom WriteSyncer
	writeSyncer := &testWriteSyncer{}

	// Create a zap core with the custom WriteSyncer
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.TimeKey = "" // Disable the timestamp for easier testing
	core := zapcore.NewCore(zapcore.NewJSONEncoder(encoderConfig), writeSyncer, zapcore.InfoLevel)
	logger := zap.New(core)
	return writeSyncer, logger

}
