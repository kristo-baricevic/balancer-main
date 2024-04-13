from bs4 import BeautifulSoup
from nltk.stem import PorterStemmer
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import ChatGPTSerializer
import openai
import tiktoken
import os
import json

# XXX: remove csrf_exempt usage before production
from django.views.decorators.csrf import csrf_exempt


@method_decorator(csrf_exempt, name="dispatch")
class ChatGPT(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        """
        Takes a diagnosis and returns a table of the most commonly prescribed medications for that diagnosis.
        """
        openai.api_key = os.environ.get("OPENAI_API_KEY")
        data = request.data
        serializer = ChatGPTSerializer(data=data)
        if serializer.is_valid():
            diagnosis = data["message"]
            ai_response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": f"Balancer is a powerful tool for selecting bipolar medication for patients. We are open-source and available for free use. Converstation: {diagnosis}.",
                    }
                ],
            )
            return Response({"message": ai_response}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @csrf_exempt
# def chatgpt(request: str) -> JsonResponse:
#     """
#     Takes a diagnosis and returns a table of the most commonly prescribed medications for that diagnosis.
#     """
#     openai.api_key = os.environ.get("OPENAI_API_KEY")
#     data: dict[str, str] = json.loads(request.body)

#     if data is not None:
#         diagnosis: str = data["prompt"]
#         ai_response = openai.ChatCompletion.create(
#             model="gpt-4",
#             messages=[
#                 {"role": "system", "content": f"Balancer is a powerful tool for selecting bipolar medication for patients. We are open-source and available for free use. Converstation: {diagnosis}."}
#             ]
#         )
#         return JsonResponse({"message": ai_response})

#     return JsonResponse({"error": "Failed to retrieve results from ChatGPT."})


# @csrf_exempt
# def extract_text(request: str) -> JsonResponse:
#     """
#     Takes a URL and returns a summary of page's text content.

#     Currently only uses the first 3500 tokens.
#     """
#     openai.api_key = os.environ.get("OPENAI_API_KEY")
#     data = json.loads(request.body)
#     webpage_url = data["webpage_url"]

#     response = requests.get(webpage_url)
#     soup = BeautifulSoup(response.text, "html.parser")
#     text_contents = soup.find_all("p")
#     text_contents = [p.get_text() for p in text_contents]
#     text_contents = " ".join(text_contents)

#     stemmer = PorterStemmer()
#     text_contents = text_contents.split()
#     text_contents = [stemmer.stem(word) for word in text_contents]
#     text_contents = " ".join(text_contents)

#     tokens = get_tokens(text_contents, "cl100k_base")

#     ai_response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",
#         messages=[
#             {
#                 "role": "system",
#                 "content": "Give a brief description of this medicine: %s" % tokens,
#             }
#         ],
#         max_tokens=500,
#     )

#     return JsonResponse({"message": ai_response})


# @csrf_exempt
# def diagnosis(request: str) -> JsonResponse:
#     """Takes a diagnosis and returns a table of the most commonly prescribed medications for that diagnosis."""
#     openai.api_key = os.environ.get("OPENAI_API_KEY")
#     data = json.loads(request.body)

#     if data is not None:
#         diagnosis = data["diagnosis"]

#         ai_response = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {
#                     "role": "system",
#                     "content": """Please provide a table of the most commonly prescribed medications for %s.
#                     The table should be in HTML format, without any <head> tags. It should have a maximum width
#                     of 630px, with a margin of 0 for the top and bottom. The table should consist of two columns:
#                     'Medication Class' and 'Medication Names'. Each cell should have a left padding and a border,
#                     and the text in the 'Medication Class' and 'Medications' cells should be displayed in bold.
#                     No other cells should be bold."""
#                     % diagnosis,
#                 }
#             ],
#             max_tokens=4000,
#         )

#         response_data = {"message": ai_response}
#         return JsonResponse(response_data)

#     # Handle the case when data is None
#     return JsonResponse({"error": "Invalid request"})


def get_tokens(string: str, encoding_name: str) -> str:
    """Tokenize the first 3500 tokens of a string."""
    encoding = tiktoken.get_encoding(encoding_name)
    tokens = encoding.encode(string)
    tokens = tokens[:3500]
    output_string = encoding.decode(tokens)
    return output_string
