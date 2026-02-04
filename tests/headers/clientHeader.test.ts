import { parse } from 'graphql';
import { exectuor } from '../exectuor';

describe('Ticket 3 - required client header', () => {
  test('Rejects when client header is missing', async () => {
    const query = `
      query {
        address(username: "jack") {
          city
        }
      }
    `;

    const result = await exectuor({
      document: parse(query),
      headers: {},
    });

    expect(result).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: "Missing required header: 'client'",
            extensions: expect.objectContaining({ code: 'BAD_USER_INPUT' }),
          }),
        ]),
      })
    );
  });
});
