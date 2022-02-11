import net from 'net'
import { OutputFormat, createOutput } from '../output/output'
import { hasCode, ErrorCodes } from './errorCodes'

const log = (...args: unknown[]) => {
  if (process.env.DEBUG === 'true') {
    console.log(...args)
  }
}

export const checkSMTP = async (
  sender: string,
  recipient: string,
  exchange: string,
  helloName: string
): Promise<OutputFormat> => {
  const timeout = 1000 * 10 // 10 seconds
  return new Promise(r => {
    let receivedData = false
    const socket = net.createConnection(25, exchange)
    socket.setEncoding('ascii')
    socket.setTimeout(timeout)
    socket.on('error', error => {
      log('error', error)
      socket.emit('fail', error)
    })
    socket.on('close', hadError => {
      if (!receivedData && !hadError) {
        socket.emit('fail', 'Mail server closed connection without sending any data.')
      }
    })
    socket.once('fail', msg => {
      const [code] = Object.typedKeys(ErrorCodes).filter(x => hasCode(msg, x))

      r(createOutput('smtp', msg, code))
      if (socket.writable && !socket.destroyed) {
        socket.write(`quit\r\n`)
        socket.end()
        socket.destroy()
      }
    })

    socket.on('success', () => {
      if (socket.writable && !socket.destroyed) {
        socket.write(`quit\r\n`)
        socket.end()
        socket.destroy()
      }
      r(createOutput())
    })

    const commands = [`EHLO ${helloName}\r\n`, `MAIL FROM: <${sender}>\r\n`, `RCPT TO: <${recipient}>\r\n`]
    let i = 0
    socket.on('next', () => {
      if (i < 3) {
        if (socket.writable) {
          socket.write(commands[i++])
        } else {
          socket.emit('fail', 'SMTP communication unexpectedly closed.')
        }
      } else {
        socket.emit('success')
      }
    })

    socket.on('timeout', () => {
      socket.emit('fail', 'Timeout')
    })

    socket.on('connect', () => {
      socket.on('data', msg => {
        receivedData = true
        log('data', msg)
        if (hasCode(msg, 220) || hasCode(msg, 250)) {
          socket.emit('next', msg)
        } else if (hasCode(msg, 550)) {
          socket.emit('fail', 'Mailbox not found.')
        } else {
          socket.emit('fail', msg)
        }
      })
    })
  })
}
