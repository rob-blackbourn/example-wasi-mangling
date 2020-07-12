const fs = require('fs')
const {
  Wasi,
  Float32Type,
  Float64Type,
  Int32Type,
  Uint32Type,
  TypedArrayType,
  FunctionPrototype,
  In
} = require('@jetblack/wasi-marshalling')

async function setupWasi (fileName, envVars) {
  // Read the wasm file.
  const buf = fs.readFileSync(fileName)

  // Create the Wasi instance passing in environment variables.
  const wasi = new Wasi(envVars)

  // Instantiate the wasm module.
  const res = await WebAssembly.instantiate(buf, {
    wasi_snapshot_preview1: wasi.imports()
  })

  // Initialize the wasi instance
  wasi.init(res.instance)

  const multiplyIntProto = new FunctionPrototype(
    [
      new In(new TypedArrayType(new Int32Type(), null)),
      new In(new TypedArrayType(new Int32Type(), null)),
      new In(new Uint32Type())
    ],
    new TypedArrayType(new Int32Type(), (i, args) => args[2])
  )
  const multiplyFloatProto = new FunctionPrototype(
    [
      new In(new TypedArrayType(new Float32Type(), null)),
      new In(new TypedArrayType(new Float32Type(), null)),
      new In(new Uint32Type())
    ],
    new TypedArrayType(new Float32Type(), (i, args) => args[2])
  )
  const multiplyDoubleProto = new FunctionPrototype(
    [
      new In(new TypedArrayType(new Float64Type(), null)),
      new In(new TypedArrayType(new Float64Type(), null)),
      new In(new Uint32Type())
    ],
    new TypedArrayType(new Float64Type(), (i, args) => args[2])
  )

  wasi.registerFunction(
    Symbol.for('*'),
    multiplyIntProto,
    wasi.instance.exports.multiply_arrays_int32_by_int32
  )

  wasi.registerFunction(
    Symbol.for('*'),
    multiplyFloatProto,
    wasi.instance.exports.multiply_arrays_float32_by_float32
  )

  wasi.registerFunction(
    Symbol.for('*'),
    multiplyDoubleProto,
    wasi.instance.exports.multiply_arrays_float64_by_float64
  )

  return wasi
}

async function main () {
  const wasi = await setupWasi('./src-wasm/example.wasm', {})

  const intResult = wasi.invoke(
    Symbol.for('*'),
    wasi.memoryManager.createTypedArray(Int32Array, [1,2,3,4]),
    wasi.memoryManager.createTypedArray(Int32Array, [1,2,3,4]),
    4)
  console.log(intResult)

  const floatResult = wasi.invoke(
    Symbol.for('*'),
    wasi.memoryManager.createTypedArray(Float32Array, [1,2,3,4]),
    wasi.memoryManager.createTypedArray(Float32Array, [1,2,3,4]),
    4)
  console.log(floatResult)

  const doubleResult = wasi.invoke(
    Symbol.for('*'),
    wasi.memoryManager.createTypedArray(Float64Array, [1,2,3,4]),
    wasi.memoryManager.createTypedArray(Float64Array, [1,2,3,4]),
    4)
    console.log(doubleResult)
}

main()
  .then(() => console.log('Done'))
  .catch(error => console.error(error))
