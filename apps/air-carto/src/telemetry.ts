import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import {
	CompositePropagator,
	W3CBaggagePropagator,
	W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';

export const otelSDK = new NodeSDK({
	metricReader: new PrometheusExporter({
		port: 8081,
	}),
	spanProcessor: new BatchSpanProcessor(new JaegerExporter()),
	contextManager: new AsyncLocalStorageContextManager(),
	textMapPropagator: new CompositePropagator({
		propagators: [
			new JaegerPropagator(),
			new W3CTraceContextPropagator(),
			new W3CBaggagePropagator(),
			new B3Propagator(),
			new B3Propagator({
				injectEncoding: B3InjectEncoding.MULTI_HEADER,
			}),
		],
	}),
	instrumentations: [
		getNodeAutoInstrumentations(),
		new PinoInstrumentation(),
	],
});
