using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

[RequireComponent(typeof(CanvasGroup))]
public class MitigationCard : MonoBehaviour, IPointerClickHandler, IBeginDragHandler, IDragHandler, IEndDragHandler
{
    public int ID;
    public int scope;
    public int quality;
    public int time;
    public int money;
    public bool selected = false;
    private GameManager gameManager;
    private Vector3 originalSize;
    private Vector3 selectedSize;
    private Canvas canvas;
    private RectTransform rectTransform;
    private CanvasGroup canvasGroup;
    private Vector2 originalPosition;
    public GameObject zoomPanel;
    public UnityEngine.UI.Image zoomImage;
    private Button zoomCloseButton;

    private void Start()
    {
        gameManager = FindObjectOfType<GameManager>();
        originalSize = transform.localScale;
        selectedSize = originalSize * 1.1f;
        canvas = FindObjectOfType<Canvas>();
        rectTransform = GetComponent<RectTransform>();
        canvasGroup = GetComponent<CanvasGroup>();
        originalPosition = rectTransform.anchoredPosition;
        Debug.Log("Created ActionCard: " + gameObject.name + " with ID = " + ID);

        GameObject zoomCanvas = GameObject.Find("ZoomCanvas");
        if (zoomCanvas != null)
        {
            // Search for ZoomPanel inside ZoomCanvas
            zoomPanel = zoomCanvas.transform.Find("ZoomPanel").gameObject;
            if (zoomPanel != null)
            {
                // Find ZoomImage inside ZoomPanel
                zoomImage = zoomPanel.transform.Find("ZoomImage").GetComponent<UnityEngine.UI.Image>();
                if (zoomImage != null)
                {
                    // Assign sprite to ZoomImage
                    UnityEngine.UI.Image cardImage = GetComponent<UnityEngine.UI.Image>();
                    if (cardImage != null && cardImage.sprite != null)
                    {
                        zoomImage.sprite = cardImage.sprite;
                        Debug.Log("Assigned sprite to zoomImage: " + zoomImage.sprite.name);
                    }
                    else
                    {
                        Debug.LogError("Card Image component or sprite is missing.");
                    }

                    // Find and assign close button listener
                    zoomCloseButton = zoomPanel.GetComponentInChildren<Button>();
                    if (zoomCloseButton != null)
                    {
                        zoomCloseButton.onClick.AddListener(CloseZoomView);
                    }
                    else
                    {
                        Debug.LogError("Zoom Close Button not found in ZoomPanel.");
                    }
                }
                else
                {
                    Debug.LogError("ZoomImage not found inside ZoomPanel.");
                }
            }
            else
            {
                Debug.LogError("ZoomPanel not found under ZoomCanvas.");
            }
        }
        else
        {
            Debug.LogError("ZoomCanvas not found in the scene.");
        }
    }

    public void ApplyMitigation(RiskCard riskCard)
    {
        if (gameManager.selectedRiskCard != null)
        {
            Debug.Log(gameManager.selectedRiskCard.name + " is mitigated."); // Output the name of the risk card
            riskCard.Mitigated();
        }
        else
        {
            Debug.Log("No risk card selected.");
        }
    }

    public void Deletion()
    {
        Destroy(gameObject);
        gameManager.actionCardsInHand[ID] = -1;
        gameManager.DelayedAddStats(scope, quality, time, money);
    }

    public void OnPointerClick(PointerEventData eventData)
    {
        if (gameManager != null && eventData.button == PointerEventData.InputButton.Left)
        {
            gameManager.SetSelectedActionCard(this);
        } else if (gameManager != null && eventData.button == PointerEventData.InputButton.Right)
        {
            ShowZoomView();
        }
    }

    public void Select()
    {
        selected = !selected;
        UpdateSize();
    }

    public void UpdateSize()
    {
        if (selected)
        {
            transform.localScale = selectedSize;
        }
        else
        {
            transform.localScale = originalSize;
        }
    }

    public void OnBeginDrag(PointerEventData eventData)
    {
        if (eventData.button != PointerEventData.InputButton.Left)
        {
            return;
        }

        canvasGroup.alpha = 0.6f;
        canvasGroup.blocksRaycasts = false;
        originalPosition = rectTransform.anchoredPosition;
    }

    public void OnDrag(PointerEventData eventData)
    {
        if (eventData.button != PointerEventData.InputButton.Left)
        {
            return;
        }

        rectTransform.anchoredPosition += eventData.delta / canvas.scaleFactor;
    }

    public void OnEndDrag(PointerEventData eventData)
    {
        if (eventData.button != PointerEventData.InputButton.Left)
        {
            return;
        }

        canvasGroup.alpha = 1f;
        canvasGroup.blocksRaycasts = true;

        // If the card is not dropped on a valid RiskCard, return to original position
        if (!gameManager.isValidDrop)
        {
            rectTransform.anchoredPosition = originalPosition;
        }
    }

    private void ShowZoomView()
    {
        zoomImage.sprite = GetComponent<UnityEngine.UI.Image>().sprite;
        zoomPanel.SetActive(true);
    }

    public void CloseZoomView()
    {
        zoomPanel.SetActive(false);
    }
}
